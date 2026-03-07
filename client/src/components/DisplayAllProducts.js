import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

import { ProductCardGrid } from "./ProductCardGrid";
import { ProductModal } from "./ProductModal";

export const DisplayAllProducts = () => {
  const [products, setProducts] = useState([]);       // all products from server
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("name");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axios.get(`${SERVER_HOST}/api/products`)
      .then(res => {
        // ensure products is always an array
        if (isMounted) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        if (isMounted) setErrorMessage(err.response?.data?.message || err.message);
        setProducts([]); // fallback to empty array
      })
      .finally(() => { if(isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, []);

  // get categories safely
  const categories = ["All", ...Array.from(new Set(Array.isArray(products) ? products.map(p => p.category) : []))];

  // filter products
  let filtered = Array.isArray(products) ? [...products] : [];
  if (selectedCategory !== "All") filtered = filtered.filter(p => p.category === selectedCategory);
  if (searchText.trim()) filtered = filtered.filter(p => (p.name || "").toLowerCase().includes(searchText.toLowerCase()));

  // sort products
  if (sortOption === "name") filtered.sort((a,b) => (a.name || "").localeCompare(b.name || ""));
  else if (sortOption === "priceLow") filtered.sort((a,b) => (a.price || 0) - (b.price || 0));
  else if (sortOption === "priceHigh") filtered.sort((a,b) => (b.price || 0) - (a.price || 0));

  const addToCart = product => {
    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];
    const index = cart.findIndex(i => i._id === product._id);
    if(index >= 0) cart[index].qty += 1;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="storePage">
      <h2 className="storeTitle">Store</h2>

      {loading && <div className="loading">Loading products…</div>}
      {errorMessage && <div className="errorBox">Error: {errorMessage}</div>}

      <div className="storeToolbar">
        <div className="tool">
          <label>Search</label>
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search by name..." />
        </div>

        <div className="tool">
          <label>Category</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="tool">
          <label>Sort</label>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            <option value="name">Name A/Z</option>
            <option value="priceLow">Price Low-High</option>
            <option value="priceHigh">Price High-Low</option>
          </select>
        </div>
      </div>

      <ProductCardGrid products={filtered} onSelect={setSelectedProduct} onAddToCart={addToCart} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};