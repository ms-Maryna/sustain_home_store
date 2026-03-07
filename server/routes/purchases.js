const router = require("express").Router()

let purchases = []

// guest checkout
router.post("/guest", (req, res) =>
{
    const purchase =
    {
        _id: Date.now().toString(),
        customer: req.body.customer,
        items: req.body.items,
        total: req.body.total,
        date: new Date()
    }

    purchases.push(purchase)

    res.json(purchase)
})

// purchase history
router.get("/my", (req, res) =>
{
    res.json(purchases)
})

module.exports = router