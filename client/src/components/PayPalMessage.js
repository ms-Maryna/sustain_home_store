import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"

export const PayPalMessage = props =>
{
    const [heading, setHeading] = useState("")
    const [message, setMessage] = useState("")
    const [buttonColour, setButtonColour] = useState("red-button")

    useEffect(() =>
    {
        const type = props.match.params.messageType

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
    }, [props.match.params.messageType])

    return (
        <div className="payPalMessage">
            <h3>{heading}</h3>
            <p>{message}</p>

            {props.match.params.messageType === "SUCCESS"
                ? <p>Your PayPal payment confirmation is <span id="payPalPaymentID">{props.match.params.payPalPaymentID}</span></p>
                : null}

            <p id="payPalPaymentIDButton">
                <Link className={buttonColour} to={"/products"}>Continue</Link>
            </p>
        </div>
    )
}
