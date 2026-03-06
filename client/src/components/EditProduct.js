import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const EditProduct = (props) => {
  const productId = props.match.params.id; // React Router v5
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${SERVER_HOST}/api/products/${productId}`);
        setName(res.data.name);
        setCategory(res.data.category);
        setPrice(res.data.price);
        setStock(res.data.stock);
        setImages(res.data.images || []);
      } catch (err) {
        setError("Failed to load product data");
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

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
      images.forEach((img) => formData.append("images", img));

      // Authorization header with JWT token
      const token = localStorage.getItem("token");

      await axios.put(`${SERVER_HOST}/api/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect to products list page
      props.history.push("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="adminPanel">
      <h2>Edit Product</h2>
      {error && <div className="errorBox">{error}</div>}
      <form onSubmit={handleSubmit} className="productForm">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        <label>
          Price (€):
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </label>

        <label>
          Images:
          <input type="file" multiple onChange={handleImageUpload} />
        </label>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};