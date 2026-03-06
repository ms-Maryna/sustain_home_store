import React, {useEffect, useState} from "react"
import axios from "axios"

export const PurchasesDashboard = () => {
    const [purchases, setPurchases] = useState([])
    const [search, setSearch] = useState("")
    const [error, setError] = useState(null)
    const token = localStorage.getItem("token")

    useEffect(() => {
        axios.get("/purchases", {headers:{Authorization:token}})
            .then(res => setPurchases(res.data))
            .catch(() => setError("Failed to load purchases"))
    }, [token])

    const filtered = purchases.filter(p => p.customerName.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="purchasesDashboard">
            <h2>Purchases</h2>
            {error && <p className="error">{error}</p>}
            <input placeholder="Search by customer..." value={search} onChange={e=>setSearch(e.target.value)} />
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(p => (
                        <tr key={p._id}>
                            <td>{p.customerName}</td>
                            <td>{p.productName}</td>
                            <td>{p.qty}</td>
                            <td>{new Date(p.date).toLocaleDateString()}</td>
                            <td>{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}