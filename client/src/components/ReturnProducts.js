import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, RETURN_DAYS} from "../config/global_constants"
import {canReturn} from "./PurchaseHistory"

// how many of this product can still be returned (bought - already requested, rejected requests don't count)
const qtyLeft = (purchase, item) =>
{
    const requested = purchase.returns
        .filter(r => r.productId === item.productId && r.status !== "Rejected")
        .reduce((sum, r) => sum + r.qty, 0)
    return item.qty - requested
}

export const ReturnProducts = props =>
{
    const [purchases, setPurchases] = useState([])
    const [orderId, setOrderId] = useState(new URLSearchParams(props.location ? props.location.search : "").get("order") || "")
    const [productId, setProductId] = useState("")
    const [qty, setQty] = useState(1)
    const [reason, setReason] = useState("")

    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/api/purchases/my`, {headers: {authorization: localStorage.token}})
        .then(res => setPurchases(res.data))
        .catch(() => setError("Failed to load your orders"))
        .finally(() => setLoading(false))
    }, [])

    const returnableOrders = purchases.filter(canReturn)
    const order = returnableOrders.find(p => p._id === orderId)
    const returnableItems = order ? order.items.filter(i => qtyLeft(order, i) > 0) : []
    const item = returnableItems.find(i => i.productId === productId)
    const maxQty = order && item ? qtyLeft(order, item) : 1

    // all return requests from all orders, newest first
    const allReturns = purchases
        .flatMap(p => (p.returns || []).map(r => ({...r, orderId: p._id})))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const changeOrder = id =>
    {
        setOrderId(id)
        setProductId("")
        setQty(1)
    }

    const handleSubmit = e =>
    {
        e.preventDefault()
        setError("")
        setSuccess("")

        if(!order) return setError("Please choose an order")
        if(!item) return setError("Please choose a product")
        if(qty < 1 || qty > maxQty) return setError(`Quantity must be between 1 and ${maxQty}`)
        if(reason.trim().length < 5) return setError("Please write a reason (at least 5 characters)")

        setSending(true)

        axios.post(`${SERVER_HOST}/api/purchases/${order._id}/returns`,
            {productId: item.productId, qty: Number(qty), reason: reason.trim()},
            {headers: {authorization: localStorage.token}}
        )
        .then(res =>
        {
            setPurchases(purchases.map(p => p._id === res.data._id ? res.data : p))
            setSuccess(`Return request sent for ${qty} x ${item.name}. We will contact you soon.`)
            setProductId("")
            setQty(1)
            setReason("")
        })
        .catch(err => setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Could not send the return request"))
        .finally(() => setSending(false))
    }

    return (
        <div className="returnsPage">

            <h2>Return Products</h2>

            <p>You can return products within {RETURN_DAYS} days after payment. Choose the order and the product, and tell us why you want to return it.</p>

            {error ? <div className="errorBox">{error}</div> : null}
            {success ? <div className="successBox">{success}</div> : null}
            {loading ? <p className="loading">Loading your orders…</p> : null}

            {!loading && returnableOrders.length === 0 ?
                <div className="info-box">
                    You have no orders that can be returned.
                    <div style={{marginTop: "10px"}}>
                        <Link className="blue-button" to="/account/history">View my orders</Link>
                    </div>
                </div>
            : null}

            {returnableOrders.length > 0 ?
                <form className="returnForm" onSubmit={handleSubmit} noValidate>

                    <label htmlFor="returnOrder">Order</label>
                    <select id="returnOrder" value={orderId} onChange={e => changeOrder(e.target.value)}>
                        <option value="">-- Choose an order --</option>
                        {returnableOrders.map(p =>
                            <option key={p._id} value={p._id}>
                                #{p._id.slice(-6).toUpperCase()} — {new Date(p.date).toLocaleDateString("en-IE")} — €{p.total.toFixed(2)}
                            </option>
                        )}
                    </select>

                    {order && returnableItems.length === 0 ?
                        <p className="empty">All products from this order were already returned.</p>
                    : null}

                    {order && returnableItems.length > 0 ?
                        <>
                            <label htmlFor="returnProduct">Product</label>
                            <select id="returnProduct" value={productId} onChange={e => { setProductId(e.target.value); setQty(1) }}>
                                <option value="">-- Choose a product --</option>
                                {returnableItems.map(i =>
                                    <option key={i.productId} value={i.productId}>{i.name} (max {qtyLeft(order, i)})</option>
                                )}
                            </select>

                            <label htmlFor="returnQty">Quantity</label>
                            <input id="returnQty" type="number" min="1" max={maxQty} value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)}/>

                            <label htmlFor="returnReason">Reason</label>
                            <textarea id="returnReason" rows="3" maxLength="500" placeholder="For example: the product arrived damaged" value={reason} onChange={e => setReason(e.target.value)}/>

                            <button type="submit" className="green-button" disabled={sending}>
                                {sending ? "Sending..." : "Send return request"}
                            </button>
                        </>
                    : null}

                </form>
            : null}

            {allReturns.length > 0 ?
                <>
                    <h3>My return requests</h3>
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allReturns.map(r =>
                                <tr key={r._id}>
                                    <td>#{r.orderId.slice(-6).toUpperCase()}</td>
                                    <td>{r.name}</td>
                                    <td>{r.qty}</td>
                                    <td>{new Date(r.date).toLocaleDateString("en-IE")}</td>
                                    <td><span className={"statusPill status" + r.status}>{r.status}</span></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            : null}

        </div>
    )
}
