import React, {useState, useEffect} from "react"
import {Link, Redirect} from "react-router-dom"

export const Cart = props =>
{
    const [cartItems, setCartItems] = useState([])
    const [redirectToCheckout, setRedirectToCheckout] = useState(false)

    useEffect(() =>
    {
        const saved = localStorage.getItem("cart")
        if(saved)
        {
            setCartItems(JSON.parse(saved))
        }
    }, [])

    const saveCart = items =>
    {
        setCartItems(items)
        localStorage.setItem("cart", JSON.stringify(items))
    }

    const increaseQty = id =>
    {
        const updated = cartItems.map(i =>
        {
            if(i._id === id) return {...i, qty: i.qty + 1}
            return i
        })
        saveCart(updated)
    }

    const decreaseQty = id =>
    {
        const updated = cartItems.map(i =>
        {
            if(i._id === id) return {...i, qty: i.qty - 1}
            return i
        })
        .filter(i => i.qty > 0)

        saveCart(updated)
    }

    const removeItem = id =>
    {
        const updated = cartItems.filter(i => i._id !== id)
        saveCart(updated)
    }

    const clearCart = () =>
    {
        saveCart([])
    }

    const getTotal = () =>
    {
        let total = 0
        cartItems.forEach(i =>
        {
            total = total + (i.price * i.qty)
        })
        return total
    }

    return (
        <div className="form-container">
            {redirectToCheckout ? <Redirect to="/checkout"/>: null}

            <h3>Cart</h3>

            {cartItems.length === 0 ?
                <div className="info-box">
                    Your cart is empty.
                    <div style={{marginTop:"10px"}}>
                        <Link className="blue-button" to="/products">Go to Store</Link>
                    </div>
                </div>
            :
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Sub-total</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {cartItems.map(i =>
                                <tr key={i._id}>
                                    <td>{i.name}</td>
                                    <td>€{i.price}</td>
                                    <td>
                                        <button className="small" onClick={() => decreaseQty(i._id)}>-</button>
                                        <span style={{margin:"0 10px"}}>{i.qty}</span>
                                        <button className="small" onClick={() => increaseQty(i._id)}>+</button>
                                    </td>
                                    <td>€{(i.price * i.qty).toFixed(2)}</td>
                                    <td>
                                        <button className="red-button" onClick={() => removeItem(i._id)}>Remove</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="cart-summary">
                        <p><b>Total:</b> €{getTotal().toFixed(2)}</p>

                        <button className="grey-button" onClick={clearCart}>Clear Cart</button>
                        <span className="gap"></span>
                        <button className="green-button" onClick={() => setRedirectToCheckout(true)}>Checkout</button>
                    </div>
                </>
            }
        </div>
    )
}

