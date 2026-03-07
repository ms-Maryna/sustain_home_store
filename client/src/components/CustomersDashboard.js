import React, {useEffect, useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import {SERVER_HOST} from "../config/global_constants"

export const CustomersDashboard = () => {

const [customers,setCustomers] = useState([])
const [search,setSearch] = useState("")
const [error,setError] = useState(null)

const token = localStorage.getItem("token")


useEffect(() => {
  axios.get(`${SERVER_HOST}/api/users`, {
    headers: { Authorization: token }
  })
  .then(res => setCustomers(res.data))
  .catch(() => setError("Failed to load customers"))
}, [token])

const filtered = customers.filter(c =>
c.name.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="customersDashboard">

<h2>Customers</h2>

{error && <p className="error">{error}</p>}

<input
  placeholder="Search customer..."
  value={search}
  onChange={e => setSearch(e.target.value)}
/>

<table className="adminTable">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Access Level</th>
      <th>Details</th>
    </tr>
  </thead>

  <tbody>
    {filtered.map(c => (
      <tr key={c._id}>
        <td>{c.name}</td>
        <td>{c.email}</td>
        <td>{c.accessLevel}</td>
        <td>
          <Link to={`/admin/customers/${c._id}`} className="viewLink">
            View
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>

</div>



)

}