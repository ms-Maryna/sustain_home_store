import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants"

export const ProductsAdminList = () => {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  const categories = ["all", ...new Set(products.map(p => p.category))]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${SERVER_HOST}/api/products`, {
          headers: { Authorization: token }
        })
        setProducts(res.data)
      } catch (err) {
        setError("Failed to load products")
      }
    }
    fetchProducts()
  }, [token])

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return
    try {
      await axios.delete(`${SERVER_HOST}/api/products/${id}`, {
        headers: { Authorization: token }
      })
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      setError("Failed to delete product")
    }
  }

  const filteredProducts = products
    .filter(p => filter === "all" || p.category === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortField === "name" ? a.name.localeCompare(b.name) : a[sortField] - b[sortField])

  return (
    <div className="productsTable">
      <h2>Products</h2>
      {error && <p className="error">{error}</p>}

      <div className="controls">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          {categories.map(c => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
        <select value={sortField} onChange={e => setSortField(e.target.value)} aria-label="Sort by">
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="stock">Sort: Stock</option>
        </select>
        <Link to="/products/add" className="btnAdd">Add Product</Link>
      </div>

      <table className="productsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredProducts.map(p => (
    <tr key={p._id}>
      <td>{p.name}</td>
      <td>{p.category}</td>
      <td>€{Number(p.price).toFixed(2)}</td>
      <td>{p.stock}</td>
      <td className="actionsCell">
        <Link to={`/products/edit/${p._id}`} className="editBtn">Edit</Link>
        <button className="deleteBtn" onClick={() => handleDelete(p._id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  )
}