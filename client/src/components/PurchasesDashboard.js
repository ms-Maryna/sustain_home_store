import React, {useEffect, useState} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const PurchasesDashboard = () => {

    const [purchases, setPurchases] = useState([])
    const [search, setSearch] = useState("")
    const [error, setError] = useState(null)

    useEffect(() => {

        axios.get(`${SERVER_HOST}/purchases/my`)
        .then(res => {
            setPurchases(res.data)
        })
        .catch(() => {
            setError("Failed to load purchases")
        })

    }, [])

    const filtered = purchases.filter(p =>
        p.customer?.toLowerCase().includes(search.toLowerCase())
    )

    return (

        <div className="purchasesDashboard">

            <h2>Purchases</h2>

            {error && <p>{error}</p>}

            <input
                placeholder="Search customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <table>

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
                            <td>{p.customer}</td>
                            <td>${p.total}</td>
                            <td>{new Date(p.date).toLocaleDateString()}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    )
}