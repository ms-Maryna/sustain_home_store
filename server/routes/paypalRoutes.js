const router = require("express").Router()
const paypalClient = require("../config/paypal")
const paypal = require("@paypal/checkout-server-sdk")

// CREATE ORDER
router.post("/create-order", async (req, res) => {

    const request = new paypal.orders.OrdersCreateRequest()

    request.prefer("return=representation")

    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "EUR",
                    value: req.body.total
                }
            }
        ],
        application_context: {
            return_url: "http://localhost:3000/paypal/SUCCESS",
            cancel_url: "http://localhost:3000/paypal/CANCEL"
        }
    })

    try {

        const order = await paypalClient.execute(request)

        res.json({
            id: order.result.id
        })

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: "PayPal order error" })

    }

})


// CAPTURE PAYMENT 
router.post("/capture-order/:orderID", async (req, res) => {

    const request = new paypal.orders.OrdersCaptureRequest(req.params.orderID)

    request.requestBody({})

    try {

        const capture = await paypalClient.execute(request)

        res.json(capture.result)

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: "Capture failed" })

    }

})

module.exports = router