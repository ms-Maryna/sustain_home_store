import React, {useState, useEffect} from "react"
import {Link, Redirect} from "react-router-dom"
import {SERVER_HOST} from "../config/global_constants"
import {getCart, saveCart, clearCart, refreshCart, getCartTotal} from "../config/cart"

export const Cart = props =>
{
    const [cartItems, setCartItems] = useState(getCart())
    const [notice, setNotice] = useState("")
    const [redirectToCheckout, setRedirectToCheckout] = useState(false)

    // get the newest prices and stock from the server
    useEffect(() =>
    {
        refreshCart()
        .then(result =>
        {
            setCartItems(result.items)
            if(result.changed)
            {
                setNotice("Some products in your cart were updated (price, stock or no longer available).")
            }
        })
        .catch(() => setNotice("Could not check the latest prices. Please try again later."))
    }, [])

    const updateCart = items =>
    {
        setCartItems(items)
        saveCart(items)
    }

    const increaseQty = id =>
    {
        updateCart(cartItems.map(i => (i._id === id && i.qty < i.stock) ? {...i, qty: i.qty + 1} : i))
    }

    const decreaseQty = id =>
    {
        updateCart(cartItems.map(i => i._id === id ? {...i, qty: i.qty - 1} : i).filter(i => i.qty > 0))
    }

    const removeItem = id =>
    {
        updateCart(cartItems.filter(i => i._id !== id))
    }

    const handleClearCart = () =>
    {
        clearCart()
        setCartItems([])
    }

    return (
        <div className="form-container">
            {redirectToCheckout ? <Redirect to="/products/checkout"/> : null}

            <h3>Cart</h3>

            {notice ? <div className="info-box noticeBox">{notice}</div> : null}

            {cartItems.length === 0 ?
                <div className="info-box">
                    Your cart is empty.
                    <div style={{marginTop: "10px"}}>
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
                                    <td className="cartProduct">
                                        {i.image ? <img src={`${SERVER_HOST}/uploads/products/${i.image}`} alt=""/> : null}
                                        {i.name}
                                    </td>
                                    <td>€{i.price.toFixed(2)}</td>
                                    <td>
                                        <button className="small" onClick={() => decreaseQty(i._id)} aria-label={`Remove one ${i.name}`}>-</button>
                                        <span style={{margin: "0 10px"}}>{i.qty}</span>
                                        <button
                                            className="small"
                                            onClick={() => increaseQty(i._id)}
                                            disabled={i.qty >= i.stock}
                                            title={i.qty >= i.stock ? "No more in stock" : ""}
                                            aria-label={`Add one ${i.name}`}
                                        >+</button>
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
                        <p><b>Total:</b> €{getCartTotal(cartItems).toFixed(2)}</p>

                        <button className="grey-button" onClick={handleClearCart}>Clear Cart</button>
                        <span className="gap"></span>
                        <button className="green-button" onClick={() => setRedirectToCheckout(true)}>Checkout</button>
                    </div>
                </>
            }
        </div>
    )
}
