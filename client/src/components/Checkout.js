import React, {useState, useEffect} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const Checkout = props =>
{
    const [cartItems, setCartItems] = useState([])

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [redirectToPayment, setRedirectToPayment] = useState(false)

    useEffect(() =>
    {
        const saved = localStorage.getItem("cart")
        if(saved)
        {
            setCartItems(JSON.parse(saved))
        }
    }, [])

    const getTotal = () =>
    {
        let total = 0
        cartItems.forEach(i =>
        {
            total = total + (i.price * i.qty)
        })
        return total
    }

    const validate = () =>
    {
        if(name.trim().length < 2) return "Name must be at least 2 characters"
        if(address.trim().length < 5) return "Address must be at least 5 characters"
        if(!/^[0-9+\s]{7,20}$/.test(phone)) return "Phone must be 7-20 digits (you can use + and spaces)"
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email is not valid"
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

        const purchaseObject =
        {
            customer:
            {
                name: name,
                address: address,
                phone: phone,
                email: email
            },
            items: cartItems,
            total: getTotal()
        }

        axios.post(`${SERVER_HOST}/api/purchases/guest`, purchaseObject)
        .then(res =>
        {
            // save purchase id for payment page
            localStorage.setItem("lastPurchaseId", res.data._id)
            //paypal
            localStorage.setItem("cartTotal", getTotal())
            // clear cart
            localStorage.setItem("cart", JSON.stringify([]))

            setRedirectToPayment(true)
        })
        .catch(err =>
        {
            const msg2 = err.response ? err.response.data : err.message
            setErrorMessage(String(msg2))
        })
    }

    return (
        <div className="form-container">
            {redirectToPayment ? <Redirect to="/products/payment"/> : null}

            <h3>Checkout</h3>

            {errorMessage ?
                <div className="error-box">
                    {errorMessage}
                </div>
            : null}

            {cartItems.length === 0 ?
                <div className="info-box">
                    Your cart is empty.
                    <div style={{marginTop:"10px"}}>
                        <Link className="blue-button" to="/products">Go to Store</Link>
                    </div>
                </div>
            :
                <>
                    <div className="checkout-summary">
                        <p><b>Items:</b> {cartItems.length}</p>
                        <p><b>Total:</b> €{getTotal().toFixed(2)}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div>
                            <label>Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} />
                        </div>

                        <div>
                            <label>Address</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} />
                        </div>

                        <div>
                            <label>Phone</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>

                        <div>
                            <label>Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <button type="submit" className="green-button">Continue to Payment</button>
                        <span className="gap"></span>
                        <Link className="grey-button" to="/products/cart">Back to Cart</Link>
                    </form>
                </>
            }
        </div>
    )
}

