const router = require("express").Router()
const mongoose = require("mongoose")
const createError = require("http-errors")
const paypal = require("@paypal/checkout-server-sdk")

const paypalClient = require("../config/paypal")
const purchasesModel = require("../models/purchases")
const productsModel = require("../models/products")

// where PayPal sends the customer back (the React site)
const CLIENT_URL = process.env.CLIENT_URL || process.env.LOCAL_HOST


// ===== CREATE PAYPAL ORDER =====
// The client sends ONLY the purchaseId.
// The amount comes from the order saved in the database (calculated by the server),
// so the customer cannot change the price.
router.post("/create-order", async (req, res, next) =>
{
    try
    {
        const purchaseId = req.body.purchaseId
        if(!mongoose.Types.ObjectId.isValid(purchaseId)) return next(createError(400, "Invalid order"))

        const purchase = await purchasesModel.findById(purchaseId)
        if(!purchase) return next(createError(404, "Order not found"))
        if(purchase.status === "Paid") return next(createError(400, "This order is already paid"))
        if(purchase.status === "Cancelled") return next(createError(400, "This order was cancelled"))

        const request = new paypal.orders.OrdersCreateRequest()
        request.prefer("return=representation")
        request.requestBody(
        {
            intent: "CAPTURE",
            purchase_units:
            [
                {
                    reference_id: purchase._id.toString(),
                    amount:
                    {
                        currency_code: "EUR",
                        value: purchase.total.toFixed(2)
                    }
                }
            ],
            application_context:
            {
                brand_name: "Sustain Home Store",
                user_action: "PAY_NOW",
                return_url: `${CLIENT_URL}/paypal/SUCCESS`,
                cancel_url: `${CLIENT_URL}/paypal/CANCEL`
            }
        })

        const order = await paypalClient.execute(request)

        // remember which PayPal order belongs to this purchase
        purchase.paypalOrderId = order.result.id
        await purchase.save()

        const approveLink = (order.result.links || []).find(l => l.rel === "approve")

        res.json(
        {
            id: order.result.id,
            approveUrl: approveLink ? approveLink.href : `https://www.sandbox.paypal.com/checkoutnow?token=${order.result.id}`
        })
    }
    catch(err)
    {
        console.error(err)
        next(createError(500, "PayPal order error"))
    }
})


// ===== CAPTURE PAYMENT =====
// Called by the client after PayPal sends the customer back to /paypal/SUCCESS?token=ORDER_ID
router.post("/capture-order/:orderID", async (req, res, next) =>
{
    try
    {
        const purchase = await purchasesModel.findOne({paypalOrderId: req.params.orderID})
        if(!purchase) return next(createError(404, "Order not found"))

        // already captured before (for example the page was refreshed)
        if(purchase.status === "Paid") return res.json({status: "Paid", purchaseId: purchase._id, total: purchase.total})

        // check stock again before taking the money
        for(const item of purchase.items)
        {
            const product = await productsModel.findById(item.productId)
            if(!product || product.stock < item.qty)
            {
                return next(createError(409, `Sorry, ${item.name} is now out of stock. You were not charged.`))
            }
        }

        const request = new paypal.orders.OrdersCaptureRequest(req.params.orderID)
        request.requestBody({})
        const capture = await paypalClient.execute(request)

        // make sure PayPal really took the right amount
        const unit = capture.result.purchase_units && capture.result.purchase_units[0]
        const payment = unit && unit.payments && unit.payments.captures && unit.payments.captures[0]

        if(capture.result.status !== "COMPLETED" || !payment || Number(payment.amount.value) !== purchase.total)
        {
            return next(createError(400, "Payment was not completed"))
        }

        purchase.status = "Paid"
        purchase.paidAt = new Date()
        await purchase.save()

        // take the sold products out of stock
        for(const item of purchase.items)
        {
            await productsModel.updateOne({_id: item.productId, stock: {$gte: item.qty}}, {$inc: {stock: -item.qty}})
        }

        res.json({status: "Paid", purchaseId: purchase._id, total: purchase.total})
    }
    catch(err)
    {
        console.error(err)
        next(createError(500, "Capture failed"))
    }
})

module.exports = router
