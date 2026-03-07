import React, {useEffect, useState} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const PurchasesDashboard = () => {

    const [purchases, setPurchases] = useState([])
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        axios.get(`${SERVER_HOST}/api/purchases/my`)
        .then(res => {
            setPurchases(res.data)
        })
        .catch(() => {
            setError("Failed to load purchases")
        })
    }, [])

    const getCustomerName = customer => {
        if (!customer) {
            return ""
        }

        if (typeof customer === "string") {
            return customer
        }

        if (typeof customer === "object") {
            return customer.name || customer.email || "Guest"
        }

        return String(customer)
    }

    const filtered = purchases.filter(p => {
        const customerName = getCustomerName(p.customer)
        return customerName.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className="purchasesDashboard">

            <h2>Purchases</h2>

            {error && <p className="error">{error}</p>}

            <input
                placeholder="Search customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <table className="adminTable">

                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map(p => (
                        <tr key={p._id}>
                            <td>{getCustomerName(p.customer)}</td>
                            <td>${p.total}</td>
                            <td>{new Date(p.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    )
}