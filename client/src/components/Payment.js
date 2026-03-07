import React from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import { NavLink } from "react-router-dom"

export const Payment = () =>
{
    
    
    const purchaseId = localStorage.getItem("lastPurchaseId")
    const total = localStorage.getItem("cartTotal")
    


if(!purchaseId || !total)
{
    return (
        <div className="paymentPage">
            <h3>No purchase found</h3>
            <NavLink to="/products" className="blue-button">
                Go to Store
            </NavLink>
        </div>
    )
}

    const handlePayPal = async () =>
    {
        
        if(!purchaseId || !total || Number(total) <= 0)
        {
            alert("Your cart is empty. Please add products before payment.")
            return
        }

        try
        {
            const res = await axios.post(`${SERVER_HOST}/api/paypal/create-order`, {
                total: total
            })

            const orderId = res.data.id

            window.location.href =
            `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`
        }
        catch(err)
        {
            console.error(err)
            alert("Payment service is currently unavailable.")
        }
    }

    return (
        <div className="paymentPage">

            <h2>Payment</h2>

            <NavLink to="/home" className="nav-link">
                Home
            </NavLink>

            <div className="paymentCard">

              

                <p>
                    Complete your purchase using PayPal secure payment.
                </p>

                <button
                    className="green-button"
                    onClick={handlePayPal}
                >
                    Pay with PayPal
                </button>

            </div>

        </div>
    )
}