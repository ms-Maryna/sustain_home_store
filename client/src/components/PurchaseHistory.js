import React, {useEffect, useState} from "react"
import {Link, Redirect} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, RETURN_DAYS} from "../config/global_constants"

// can this order still be returned? (paid and not older than RETURN_DAYS)
export const canReturn = purchase =>
{
    if(purchase.status !== "Paid") return false
    const start = new Date(purchase.paidAt || purchase.date)
    return Date.now() - start.getTime() <= RETURN_DAYS * 24 * 60 * 60 * 1000
}

const statusClass = status => "statusPill status" + status

export const PurchaseHistory = () =>
{
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [goToPayment, setGoToPayment] = useState(false)

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/api/purchases/my`, {headers: {authorization: localStorage.token}})
        .then(res => setPurchases(res.data))
        .catch(() => setError("Failed to load purchases"))
        .finally(() => setLoading(false))
    }, [])

    // a pending (not paid) order can be paid from here
    const payNow = id =>
    {
        localStorage.setItem("lastPurchaseId", id)
        setGoToPayment(true)
    }

    if(goToPayment) return <Redirect to="/products/payment"/>

    return (
        <div className="purchaseHistoryPage">

            <h2>Purchase History</h2>

            {error ? <div className="errorBox">{error}</div> : null}
            {loading ? <p className="loading">Loading your orders…</p> : null}

            {!loading && !error && purchases.length === 0 ?
                <div className="info-box">
                    You have no orders yet.
                    <div style={{marginTop: "10px"}}>
                        <Link className="blue-button" to="/products">Start shopping</Link>
                    </div>
                </div>
            : null}

            <div className="purchaseGrid">
                {purchases.map(p =>
                    <div key={p._id} className="purchaseCard">

                        <div className="purchaseHeader">
                            <span>Order #{p._id.slice(-6).toUpperCase()}</span>
                            <span className={statusClass(p.status)}>{p.status === "Pending" ? "Not paid" : p.status}</span>
                        </div>

                        <div className="purchaseDate">{new Date(p.date).toLocaleDateString("en-IE")}</div>

                        <div className="purchaseItems">
                            {p.items.map(item =>
                                <div key={item.productId} className="purchaseItem">
                                    {item.image ?
                                        <img src={`${SERVER_HOST}/uploads/products/${item.image}`} alt={item.name}/>
                                    : null}
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p>{item.qty} x €{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {p.returns && p.returns.length > 0 ?
                            <div className="purchaseReturns">
                                <b>Returns:</b>
                                {p.returns.map(r =>
                                    <div key={r._id}>
                                        {r.qty} x {r.name} — <span className={statusClass(r.status)}>{r.status}</span>
                                    </div>
                                )}
                            </div>
                        : null}

                        <div className="purchaseFooter">
                            <span>Total: €{p.total.toFixed(2)}</span>

                            {p.status === "Pending" ?
                                <button className="green-button" onClick={() => payNow(p._id)}>Pay now</button>
                            : null}

                            {canReturn(p) ?
                                <Link className="grey-button" to={`/account/returns?order=${p._id}`}>Return items</Link>
                            : null}
                        </div>

                    </div>
                )}
            </div>

        </div>
    )
}
