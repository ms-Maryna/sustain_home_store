import React, {useState, useEffect} from "react"
import {NavLink} from "react-router-dom"
import {getCartCount, onCartChange} from "../config/cart"

export const StoreMenu = props =>
{
    const [cartCount, setCartCount] = useState(getCartCount())

    // update the number on the Cart link every time the cart changes
    useEffect(() => onCartChange(() => setCartCount(getCartCount())), [])

    const purchaseId = localStorage.getItem("lastPurchaseId")

    return (
        <div className="storeMenu">
            <NavLink exact to="/products" className="storeLink" activeClassName="storeLinkActive">
                Products
            </NavLink>

            <NavLink exact to="/products/cart" className="storeLink" activeClassName="storeLinkActive">
                Cart {cartCount > 0 ? <span className="cartBadge">{cartCount}</span> : null}
            </NavLink>

            <NavLink exact to="/products/checkout" className="storeLink" activeClassName="storeLinkActive">
                Checkout
            </NavLink>

            {purchaseId ?
                <NavLink exact to="/products/payment" className="storeLink" activeClassName="storeLinkActive">
                    Payment
                </NavLink>
            : null}
        </div>
    )
}
