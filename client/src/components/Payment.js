import React, {useState, useEffect} from "react"
import axios from "axios"
import {NavLink} from "react-router-dom"
import {SERVER_HOST} from "../config/global_constants"

export const Payment = () =>
{
    const purchaseId = localStorage.getItem("lastPurchaseId")

    const [purchase, setPurchase] = useState(null)
    const [loading, setLoading] = useState(Boolean(purchaseId))
    const [paying, setPaying] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    // load the order from the server - the total shown here is the one calculated by the server
    useEffect(() =>
    {
        if(!purchaseId) return

        axios.get(`${SERVER_HOST}/api/purchases/${purchaseId}`)
        .then(res => setPurchase(res.data))
        .catch(() =>
        {
            localStorage.removeItem("lastPurchaseId")
            setErrorMessage("Order not found")
        })
        .finally(() => setLoading(false))
    }, [purchaseId])

    const handlePayPal = () =>
    {
        setPaying(true)
        setErrorMessage("")

        // only the order id is sent - the server takes the amount from the database
        axios.post(`${SERVER_HOST}/api/paypal/create-order`, {purchaseId: purchaseId})
        .then(res =>
        {
            window.location.href = res.data.approveUrl
        })
        .catch(err =>
        {
            setPaying(false)
            setErrorMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Payment service is currently unavailable.")
        })
    }

    if(loading)
    {
        return <div className="paymentPage"><p className="loading">Loading your order…</p></div>
    }

    if(!purchase)
    {
        return (
            <div className="paymentPage">
                <h3>No order found</h3>
                {errorMessage ? <div className="errorBox">{errorMessage}</div> : null}
                <p>Please add products to your cart and go to checkout first.</p>
                <NavLink to="/products" className="blue-button">Go to Store</NavLink>
            </div>
        )
    }

    return (
        <div className="paymentPage">
            <div className="paymentContainer">

                <h2 className="paymentTitle">Payment</h2>

                <NavLink to="/products" className="paymentBackLink">
                    ← Back to Store
                </NavLink>

                <div className="paymentCard">

                    {errorMessage ? <div className="errorBox">{errorMessage}</div> : null}

                    {purchase.status === "Paid" ?
                        <div className="successBox">This order is already paid. Thank you!</div>
                    :
                        <p className="paymentText">
                            Complete your purchase using secure PayPal payment.
                        </p>
                    }

                    <div className="paymentItems">
                        {purchase.items.map(i =>
                            <div key={i.productId} className="paymentItem">
                                <span>{i.qty} x {i.name}</span>
                                <span>€{(i.price * i.qty).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="paymentSummary">
                        <span>Total:</span>
                        <strong>€{purchase.total.toFixed(2)}</strong>
                    </div>

                    {purchase.status === "Pending" ?
                        <button className="paypalButton" onClick={handlePayPal} disabled={paying}>
                            {paying ? "Opening PayPal..." : "Pay with PayPal"}
                        </button>
                    : null}

                </div>

            </div>
        </div>
    )
}
