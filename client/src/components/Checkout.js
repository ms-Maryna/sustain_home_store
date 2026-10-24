import React, {useState, useEffect} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, ACCESS_LEVEL_GUEST} from "../config/global_constants"
import {getCart, refreshCart, getCartTotal} from "../config/cart"

export const Checkout = props =>
{
    const [cartItems, setCartItems] = useState(getCart())

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [notice, setNotice] = useState("")
    const [sending, setSending] = useState(false)
    const [redirectToPayment, setRedirectToPayment] = useState(false)

    const isLoggedIn = parseInt(localStorage.accessLevel) > ACCESS_LEVEL_GUEST

    useEffect(() =>
    {
        // get the newest prices and stock from the server
        refreshCart()
        .then(result =>
        {
            setCartItems(result.items)
            if(result.changed) setNotice("Some products in your cart were updated. Please check your order.")
        })
        .catch(() => {})

        // logged in users: fill in the form with the details from the profile
        if(isLoggedIn)
        {
            axios.get(`${SERVER_HOST}/api/users/profile`, {headers: {authorization: localStorage.token}})
            .then(res =>
            {
                setName(res.data.name || "")
                setEmail(res.data.email || "")
                setPhone(res.data.phone || "")
                setAddress(res.data.address || "")
            })
            .catch(() => {})
        }
    }, [isLoggedIn])

    const validate = () =>
    {
        if(name.trim().length < 2) return "Name must be at least 2 characters"
        if(address.trim().length < 5) return "Address must be at least 5 characters"
        if(!/^[0-9+\s]{7,20}$/.test(phone.trim())) return "Phone must be 7-20 digits (you can use + and spaces)"
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is not valid"
        if(cartItems.length === 0) return "Cart is empty"
        return ""
    }

    const handleSubmit = e =>
    {
        e.preventDefault()

        const msg = validate()
        if(msg !== "")
        {
            setErrorMessage(msg)
            return
        }

        setErrorMessage("")
        setSending(true)

        // Only product ids and quantities are sent.
        // The server finds the real prices in the database and calculates the total itself.
        const purchaseObject =
        {
            customer:
            {
                name: name.trim(),
                address: address.trim(),
                phone: phone.trim(),
                email: email.trim()
            },
            items: cartItems.map(i => ({_id: i._id, qty: i.qty}))
        }

        // the token links the order to the user account (guests have no token)
        const headers = isLoggedIn ? {authorization: localStorage.token} : {}

        axios.post(`${SERVER_HOST}/api/purchases`, purchaseObject, {headers})
        .then(res =>
        {
            // the payment page loads the order (and the real total) from the server using this id
            localStorage.setItem("lastPurchaseId", res.data._id)

            // the cart is cleared only after the payment is successful (see PayPalMessage.js)
            setRedirectToPayment(true)
        })
        .catch(err =>
        {
            setSending(false)
            setErrorMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Could not create the order. Please try again.")
        })
    }

    return (
        <div className="form-container">
            {redirectToPayment ? <Redirect to="/products/payment"/> : null}

            <h3>Checkout</h3>

            {notice ? <div className="info-box noticeBox">{notice}</div> : null}

            {errorMessage ? <div className="error-box">{errorMessage}</div> : null}

            {cartItems.length === 0 ?
                <div className="info-box">
                    Your cart is empty.
                    <div style={{marginTop: "10px"}}>
                        <Link className="blue-button" to="/products">Go to Store</Link>
                    </div>
                </div>
            :
                <>
                    <div className="checkout-summary">
                        {cartItems.map(i =>
                            <p key={i._id}>{i.qty} x {i.name} — €{(i.price * i.qty).toFixed(2)}</p>
                        )}
                        <p><b>Total:</b> €{getCartTotal(cartItems).toFixed(2)}</p>
                    </div>

                    {!isLoggedIn ?
                        <p className="checkoutHint">
                            Checking out as a guest. <Link to="/login">Log in</Link> or <Link to="/register">register</Link> to fill in your details automatically and see your orders later.
                        </p>
                    : null}

                    <form onSubmit={handleSubmit} className="checkout-form" noValidate>
                        <div>
                            <label htmlFor="checkoutName">Name</label>
                            <input id="checkoutName" autoComplete="name" value={name} onChange={e => setName(e.target.value)}/>
                        </div>

                        <div>
                            <label htmlFor="checkoutAddress">Address</label>
                            <input id="checkoutAddress" autoComplete="street-address" value={address} onChange={e => setAddress(e.target.value)}/>
                        </div>

                        <div>
                            <label htmlFor="checkoutPhone">Phone</label>
                            <input id="checkoutPhone" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)}/>
                        </div>

                        <div>
                            <label htmlFor="checkoutEmail">Email</label>
                            <input id="checkoutEmail" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>

                        <button type="submit" className="green-button" disabled={sending}>
                            {sending ? "Please wait..." : "Continue to Payment"}
                        </button>
                        <span className="gap"></span>
                        <Link className="grey-button" to="/products/cart">Back to Cart</Link>
                    </form>
                </>
            }
        </div>
    )
}
