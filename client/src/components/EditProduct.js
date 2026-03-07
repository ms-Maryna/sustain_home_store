import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const EditProduct = (props) => {
  const productId = props.match.params.id;

  // State for product fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [powerUsage, setPowerUsage] = useState("");
  const [energyRating, setEnergyRating] = useState("A");
  const [condition, setCondition] = useState("new"); // must be lowercase for DB enum
  const [ecoCertified, setEcoCertified] = useState(true);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // new images to upload
  const [error, setError] = useState("");

  // Fetch product data on mount
  useEffect(() => {
    axios.get(`${SERVER_HOST}/api/products/${productId}`)
      .then(res => {
        const p = res.data;
        setName(p.name);
        setCategory(p.category);
        setBrand(p.brand);
        setPrice(p.price);
        setStock(p.stock);
        setPowerUsage(p.powerUsage);
        setEnergyRating(p.energyRating);
        setCondition(p.condition); // already lowercase from DB
        setEcoCertified(p.ecoCertified);
        setDescription(p.description);
      })
      .catch(() => setError("Failed to load product"));
  }, [productId]);

  // Handle new image selection
  const handleFilesChange = (e) => setImages(Array.from(e.target.files));

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Use FormData to support file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", Number(price)); // ensure number
      formData.append("stock", Number(stock));
      formData.append("powerUsage", Number(powerUsage));
      formData.append("energyRating", energyRating);
      formData.append("condition", condition);
      formData.append("ecoCertified", ecoCertified); // boolean
      formData.append("description", description);

      // Append new images if selected
      images.forEach(img => formData.append("images", img));

      // Send PUT request to server
      await axios.put(`${SERVER_HOST}/api/products/${productId}`, formData, {
        headers: { 
          Authorization: token, 
          "Content-Type": "multipart/form-data" 
        },
      });

      // Redirect to products list
     props.history.push("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="adminPanel">
      <h2>Edit Product</h2>
      {error && <div className="errorBox">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
        <input placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
        <input type="number" placeholder="Power Usage" value={powerUsage} onChange={e => setPowerUsage(e.target.value)} />
        <input placeholder="Energy Rating" value={energyRating} onChange={e => setEnergyRating(e.target.value)} />
        
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          {["new", "used", "refurbished"].map(c => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <label>
          Eco Certified:
          <input type="checkbox" checked={ecoCertified} onChange={e => setEcoCertified(e.target.checked)} />
        </label>

        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />

        <label>
          Upload New Images (optional):
          <input type="file" multiple accept="image/*" onChange={handleFilesChange} />
        </label>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};