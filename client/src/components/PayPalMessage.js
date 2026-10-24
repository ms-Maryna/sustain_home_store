import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, ACCESS_LEVEL_NORMAL_USER} from "../config/global_constants"
import {clearCart} from "../config/cart"

// PayPal sends the customer back to:
//   /paypal/SUCCESS?token=ORDER_ID   or   /paypal/CANCEL?token=ORDER_ID
export const PayPalMessage = props =>
{
    const type = props.match.params.messageType

    const [heading, setHeading] = useState(type === "SUCCESS" ? "Confirming your payment…" : "")
    const [message, setMessage] = useState("")
    const [paymentID, setPaymentID] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(type === "SUCCESS")

    useEffect(() =>
    {
        const token = new URLSearchParams(window.location.search).get("token")
        setPaymentID(token || "")

        if(type === "SUCCESS" && token)
        {
            // Ask the server to take the payment. The server checks the amount with PayPal.
            axios.post(`${SERVER_HOST}/api/paypal/capture-order/${token}`)
            .then(() =>
            {
                setHeading("Thank you for your order!")
                setMessage("Your PayPal payment was successful.")
                setSuccess(true)

                // the order is paid, so now the cart can be emptied
                clearCart()
                localStorage.removeItem("lastPurchaseId")
            })
            .catch(err =>
            {
                setHeading("Payment not completed")
                setMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "An error occurred. Please try again.")
            })
            .finally(() => setLoading(false))
        }
        else
        {
            setLoading(false)
        }

        if(type === "CANCEL")
        {
            setHeading("PayPal Transaction Cancelled")
            setMessage("You cancelled your PayPal payment. Your cart is still saved, so you can try again.")
        }
        else if(type !== "SUCCESS" || !token)
        {
            setHeading("PayPal Transaction Error")
            setMessage("An error occurred. Please try again.")
        }
    }, [type])

    const isUser = parseInt(localStorage.accessLevel) === ACCESS_LEVEL_NORMAL_USER

    return (
        <div className="payPalMessage">
            <h3>{heading}</h3>
            <p>{message}</p>

            {paymentID ? <p>Payment ID: <b>{paymentID}</b></p> : null}

            <p>
                {success && isUser ?
                    <Link className="green-button" to="/account/history">View my orders</Link>
                : null}
                {!success && !loading ?
                    <Link className="green-button" to="/products/payment">Try again</Link>
                : null}
                <span className="gap"></span>
                <Link className={success ? "blue-button" : "grey-button"} to="/products">Continue shopping</Link>
            </p>
        </div>
    )
}
