import React from "react"

export const Payment = () =>
{
    const purchaseId = localStorage.getItem("lastPurchaseId")

    return (
        <div className="form-container">
            <h3>Payment</h3>

            <p>Purchase ID: {purchaseId}</p>

            <p>Proceed to PayPal payment.</p>

            <button
                className="green-button"
                onClick={() =>
                    window.location.href = "/PayPalMessage/SUCCESS/" + purchaseId
                }
            >
                Pay with PayPal
            </button>
        </div>
    )
}