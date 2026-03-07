// src/components/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const AddProduct = (props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [powerUsage, setPowerUsage] = useState("");
  const [energyRating, setEnergyRating] = useState("A");
  const [condition, setCondition] = useState("new");
  const [ecoCertified, setEcoCertified] = useState(true);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

 
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files).filter(f =>
      ["image/png", "image/jpeg", "image/jpg"].includes(f.type)
    );
    setImages(files);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !brand || !price || !stock || !description || images.length === 0) {
      setError("Please fill all fields and upload at least one image");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", Number(price));
      formData.append("stock", Number(stock));
      formData.append("powerUsage", Number(powerUsage));
      formData.append("energyRating", energyRating);
      formData.append("condition", condition);
      formData.append("ecoCertified", ecoCertified);
      formData.append("description", description);

      images.forEach((img) => formData.append("images", img));

      await axios.post(`${SERVER_HOST}/api/products`, formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

     
      props.history.push("/admin/products");;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="adminPanel">
      <h2>Add Product</h2>
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
          {["new","Used","Refurbished"].map(c => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <label>
          Eco Certified:
          <input type="checkbox" checked={ecoCertified} onChange={e => setEcoCertified(e.target.checked)} />
        </label>

        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

        <label>
          Upload Images (multiple):
          <input type="file" multiple accept="image/*" onChange={handleFilesChange} />
        </label>

       
        <div className="imagePreviews">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt={`preview ${i}`}
              className="previewImg"
            />
          ))}
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};