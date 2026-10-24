const router = require("express").Router()
const mongoose = require("mongoose")
const createError = require("http-errors")

const purchasesModel = require("../models/purchases")
const productsModel = require("../models/products")
const {verifyToken, optionalToken, requireAdmin} = require("../middleware/authMiddleware")

const RETURN_DAYS = 30


// ===== Helpers =====
const isValidId = id => mongoose.Types.ObjectId.isValid(id)

const roundMoney = value => Math.round(value * 100) / 100

const isNonEmptyString = (value, minLength) => typeof value === "string" && value.trim().length >= minLength

// How many of one product were already asked to return (not counting rejected requests)
const returnedQty = (purchase, productId) =>
{
    return purchase.returns
        .filter(r => r.productId.toString() === productId.toString() && r.status !== "Rejected")
        .reduce((sum, r) => sum + r.qty, 0)
}

const returnDeadline = purchase =>
{
    const start = purchase.paidAt || purchase.date
    return new Date(start.getTime() + RETURN_DAYS * 24 * 60 * 60 * 1000)
}


// ===== CREATE ORDER (guest or logged in user) =====
// The client sends ONLY product ids and quantities.
// Names, prices and the total are taken from the database here on the server,
// so changing the price in the browser (Inspect / localStorage) has no effect.
router.post("/", optionalToken, async (req, res, next) =>
{
    try
    {
        const customer = req.body.customer || {}
        const items = req.body.items

        // --- validate customer details ---
        if(!isNonEmptyString(customer.name, 2)) return next(createError(400, "Name must be at least 2 characters"))
        if(!isNonEmptyString(customer.address, 5)) return next(createError(400, "Address must be at least 5 characters"))
        if(typeof customer.phone !== "string" || !/^[0-9+\s]{7,20}$/.test(customer.phone)) return next(createError(400, "Phone must be 7-20 digits (you can use + and spaces)"))
        if(typeof customer.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return next(createError(400, "Email is not valid"))

        // --- validate cart ---
        if(!Array.isArray(items) || items.length === 0) return next(createError(400, "Cart is empty"))

        // join the same product into one line
        const quantities = {}
        for(const item of items)
        {
            const id = item && item._id
            const qty = Number(item && item.qty)

            if(!isValidId(id)) return next(createError(400, "Invalid product in cart"))
            if(!Number.isInteger(qty) || qty < 1) return next(createError(400, "Invalid quantity in cart"))

            quantities[id] = (quantities[id] || 0) + qty
        }

        // --- read the real products from the database ---
        const ids = Object.keys(quantities)
        const products = await productsModel.find({_id: {$in: ids}})

        if(products.length !== ids.length) return next(createError(400, "Some products in your cart no longer exist. Please check your cart."))

        const orderItems = []
        let total = 0

        for(const product of products)
        {
            const qty = quantities[product._id.toString()]

            if(qty > product.stock)
            {
                return next(createError(400, `Only ${product.stock} x ${product.name} left in stock`))
            }

            orderItems.push(
            {
                productId: product._id,
                name: product.name,
                price: product.price,
                qty: qty,
                image: product.images && product.images.length > 0 ? product.images[0] : ""
            })

            total += product.price * qty
        }

        const purchase = await purchasesModel.create(
        {
            userEmail: req.user ? req.user.email : "",
            customer:
            {
                name: customer.name.trim(),
                email: customer.email.trim(),
                phone: customer.phone.trim(),
                address: customer.address.trim()
            },
            items: orderItems,
            total: roundMoney(total)
        })

        res.json(purchase)
    }
    catch(err)
    {
        next(err)
    }
})


// ===== PURCHASE HISTORY of the logged in user =====
router.get("/my", verifyToken, (req, res, next) =>
{
    purchasesModel.find({userEmail: req.user.email}).sort({date: -1})
    .then(purchases => res.json(purchases))
    .catch(err => next(err))
})


// ===== ALL PURCHASES (ADMIN) =====
router.get("/", verifyToken, requireAdmin, (req, res, next) =>
{
    purchasesModel.find({}).sort({date: -1})
    .then(purchases => res.json(purchases))
    .catch(err => next(err))
})


// ===== ONE ORDER SUMMARY (for the payment page) =====
// Guests also use this, so personal details (address, phone...) are NOT sent back
router.get("/:id", (req, res, next) =>
{
    if(!isValidId(req.params.id)) return next(createError(404, "Order not found"))

    purchasesModel.findById(req.params.id, {items: 1, total: 1, status: 1, date: 1})
    .then(purchase =>
    {
        if(!purchase) return next(createError(404, "Order not found"))
        res.json(purchase)
    })
    .catch(err => next(err))
})


// ===== REQUEST A RETURN (logged in user) =====
// body: {productId, qty, reason}
router.post("/:id/returns", verifyToken, async (req, res, next) =>
{
    try
    {
        if(!isValidId(req.params.id)) return next(createError(404, "Order not found"))

        const purchase = await purchasesModel.findById(req.params.id)

        // users can only return their own orders
        if(!purchase || purchase.userEmail !== req.user.email) return next(createError(404, "Order not found"))
        if(purchase.status !== "Paid") return next(createError(400, "Only paid orders can be returned"))
        if(new Date() > returnDeadline(purchase)) return next(createError(400, `Returns are only possible within ${RETURN_DAYS} days`))

        const {productId, reason} = req.body
        const qty = Number(req.body.qty)

        const item = purchase.items.find(i => i.productId.toString() === String(productId))
        if(!item) return next(createError(400, "This product is not in the order"))
        if(!Number.isInteger(qty) || qty < 1) return next(createError(400, "Invalid quantity"))
        if(!isNonEmptyString(reason, 5)) return next(createError(400, "Please write a reason (at least 5 characters)"))

        const left = item.qty - returnedQty(purchase, item.productId)
        if(qty > left) return next(createError(400, `You can return at most ${left} of this product`))

        purchase.returns.push(
        {
            productId: item.productId,
            name: item.name,
            qty: qty,
            reason: reason.trim()
        })

        await purchase.save()
        res.json(purchase)
    }
    catch(err)
    {
        next(err)
    }
})


// ===== APPROVE / REJECT A RETURN (ADMIN) =====
// body: {status: "Approved" | "Rejected"}
router.put("/:id/returns/:returnId", verifyToken, requireAdmin, async (req, res, next) =>
{
    try
    {
        const status = req.body.status
        if(!["Approved", "Rejected"].includes(status)) return next(createError(400, "Status must be Approved or Rejected"))
        if(!isValidId(req.params.id)) return next(createError(404, "Order not found"))

        const purchase = await purchasesModel.findById(req.params.id)
        if(!purchase) return next(createError(404, "Order not found"))

        const request = purchase.returns.id(req.params.returnId)
        if(!request) return next(createError(404, "Return request not found"))
        if(request.status !== "Requested") return next(createError(400, "This return was already processed"))

        request.status = status
        await purchase.save()

        // returned products go back into stock
        if(status === "Approved")
        {
            await productsModel.updateOne({_id: request.productId}, {$inc: {stock: request.qty}})
        }

        res.json(purchase)
    }
    catch(err)
    {
        next(err)
    }
})


module.exports = router
