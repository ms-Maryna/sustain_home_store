import React from "react"
import {NavLink} from "react-router-dom"

export const StoreMenu = props =>
{
    
    const purchaseId = localStorage.getItem("lastPurchaseId")
    return (
        <div className="storeMenu">
            <NavLink exact to="/products" className="storeLink" activeClassName="storeLinkActive">
                Products
            </NavLink>

            <NavLink exact to="/products/cart" className="storeLink" activeClassName="storeLinkActive">
                Cart
            </NavLink>

            <NavLink exact to="/products/checkout" className="storeLink" activeClassName="storeLinkActive">
                Checkout
            </NavLink>

           {purchaseId &&
<NavLink exact to="/products/payment" className="storeLink" activeClassName="storeLinkActive">
    Payment
</NavLink>
}
        </div>
    )
}