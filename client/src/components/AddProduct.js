import React, { useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const AddProduct = (props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [powerUsage, setPowerUsage] = useState("");
  const [energyRating, setEnergyRating] = useState("A");
  const [condition, setCondition] = useState("new");
  const [ecoCertified, setEcoCertified] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !category || !price || !stock || images.length === 0) {
      setError("All fields and at least one image are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("powerUsage", powerUsage);
      formData.append("energyRating", energyRating);
      formData.append("condition", condition);
      formData.append("ecoCertified", ecoCertified);
      images.forEach((img) => formData.append("images", img));

      const token = localStorage.token; // JWT from login

      await axios.post(`${SERVER_HOST}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      props.history.push("/admin/products");
    } catch (err) {
      setError(err.response?.data || "Failed to add product");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="adminPanel">
      <h2>Add New Product</h2>
      {error && <div className="errorBox">{error}</div>}
      <form onSubmit={handleSubmit} className="productForm">
        <label>Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>Category:
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
        </label>

        <label>Price (€):
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </label>

        <label>Stock:
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} />
        </label>

        <label>Power Usage (W):
          <input type="number" value={powerUsage} onChange={e => setPowerUsage(e.target.value)} />
        </label>

        <label>Energy Rating:
          <select value={energyRating} onChange={e => setEnergyRating(e.target.value)}>
            {["A","B","C","D","E","F","G"].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label>Condition:
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            {["new","used","refurbished"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>Eco Certified:
          <input type="checkbox" checked={ecoCertified} onChange={e => setEcoCertified(e.target.checked)} />
        </label>

        <label>Images:
          <input type="file" multiple onChange={handleImageUpload} />
        </label>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};