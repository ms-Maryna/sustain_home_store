import React, {useEffect, useState} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import {OrderDetails} from "./OrderDetails"

export const PurchasesDashboard = () =>
{
    const [purchases, setPurchases] = useState([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [openId, setOpenId] = useState("")
    const [error, setError] = useState("")

    const token = localStorage.getItem("token")

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/api/purchases`, {headers: {authorization: token}})
        .then(res => setPurchases(res.data))
        .catch(() => setError("Failed to load purchases"))
    }, [token])

    // approve or reject a return request
    const processReturn = (purchaseId, returnId, status) =>
    {
        axios.put(`${SERVER_HOST}/api/purchases/${purchaseId}/returns/${returnId}`, {status}, {headers: {authorization: token}})
        .then(res => setPurchases(purchases.map(p => p._id === purchaseId ? res.data : p)))
        .catch(err => setError(err.response && err.response.data ? err.response.data.message : "Failed to update the return"))
    }

    const pendingReturns = p => (p.returns || []).filter(r => r.status === "Requested").length

    const filtered = purchases
        // the order that is open stays visible, even after its return was approved
        .filter(p => p._id === openId || statusFilter === "All" || p.status === statusFilter || (statusFilter === "Returns" && pendingReturns(p) > 0))
        .filter(p =>
        {
            const text = `${p.customer.name} ${p.customer.email} ${p._id}`.toLowerCase()
            return text.includes(search.toLowerCase())
        })

    return (
        <div className="purchasesDashboard">

            <h2>Purchases</h2>

            {error ? <p className="error">{error}</p> : null}

            <div className="controls">
                <input
                    placeholder="Search customer, email or order..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="All">All orders</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Not paid</option>
                    <option value="Returns">Returns to check</option>
                </select>
            </div>

            <table className="adminTable">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map(p =>
                        <React.Fragment key={p._id}>
                            <tr>
                                <td>#{p._id.slice(-6).toUpperCase()}</td>
                                <td>{p.customer.name}{p.userEmail ? "" : " (guest)"}</td>
                                <td>€{p.total.toFixed(2)}</td>
                                <td>
                                    <span className={"statusPill status" + p.status}>{p.status === "Pending" ? "Not paid" : p.status}</span>
                                    {pendingReturns(p) > 0 ? <span className="statusPill statusRequested">{pendingReturns(p)} return(s)</span> : null}
                                </td>
                                <td>{new Date(p.date).toLocaleDateString("en-IE")}</td>
                                <td>
                                    <button className="viewLink linkButton" onClick={() => setOpenId(openId === p._id ? "" : p._id)}>
                                        {openId === p._id ? "Hide" : "Details"}
                                    </button>
                                </td>
                            </tr>

                            {openId === p._id ?
                                <tr className="detailsRow">
                                    <td colSpan="6">
                                        <OrderDetails order={p} onProcessReturn={processReturn}/>
                                    </td>
                                </tr>
                            : null}
                        </React.Fragment>
                    )}
                </tbody>
            </table>

            {filtered.length === 0 && !error ? <p className="empty">No orders found</p> : null}

        </div>
    )
}
