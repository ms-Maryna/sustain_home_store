import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"

export const PayPalMessage = props =>
{
    const [heading, setHeading] = useState("")
    const [message, setMessage] = useState("")
    const [paymentID, setPaymentID] = useState("")
    const [buttonColour, setButtonColour] = useState("red-button")

    useEffect(() =>
    {
        const type = props.match.params.messageType

        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")

        setPaymentID(token)

        if(type === "SUCCESS")
        {
            setHeading("PayPal Transaction Confirmation")
            setMessage("Your PayPal transaction was successful.")
            setButtonColour("green-button")
        }
        else if(type === "CANCEL")
        {
            setHeading("PayPal Transaction Cancelled")
            setMessage("You cancelled your PayPal transaction.")
        }
        else
        {
            setHeading("PayPal Transaction Error")
            setMessage("An error occurred. Please try again.")
        }

    }, [])

    return (
        <div className="payPalMessage">
            <h3>{heading}</h3>
            <p>{message}</p>

            {paymentID &&
                <p>
                    Payment ID: <b>{paymentID}</b>
                </p>
            }

            <p>
                <Link className={buttonColour} to="/products">
                    Continue
                </Link>
            </p>
        </div>
    )
}
//for test Paypal
//Email - sb-432yyi48480876@business.example.com
//Password - Mg?F3A!H