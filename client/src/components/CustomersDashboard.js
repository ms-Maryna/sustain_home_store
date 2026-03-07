import React, {useEffect, useState} from "react"
import axios from "axios"

const SERVER_HOST = "http://localhost:4000/api"

export const CustomersDashboard = () => {

    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState("")
    const [error, setError] = useState(null)

    const token = localStorage.getItem("token")

    useEffect(() => {

    axios.get(`${SERVER_HOST}/api/users`,{
 headers:{Authorization:token}
})
        .then(res => {
            setCustomers(res.data)
        })
        .catch(err => {
            setError("Failed to load customers")
            console.error(err)
        })

    }, [])

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="customersDashboard">

            <h2>Customers</h2>

            {error && <p className="error">{error}</p>}

            <input
                placeholder="Search..."
                value={search}
                onChange={e=>setSearch(e.target.value)}
            />

            <table>

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Access Level</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map(c => (
                        <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.accessLevel}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    )
}