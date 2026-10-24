import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";

import { ProductCardGrid } from "./ProductCardGrid";
import { ProductModal } from "./ProductModal";
import { addToCart } from "../config/cart";

export const DisplayAllProducts = () => {
  const [products, setProducts] = useState([]);       // all products from server
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("name");

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // small message after "Add to cart"
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
        if (isMounted) setProducts([]); // fallback to empty array
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

  // hide the message after 2.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAddToCart = product => {
    if (addToCart(product)) {
      setToast({ type: "success", text: `${product.name} added to cart` });
    } else {
      setToast({ type: "error", text: `Sorry, no more ${product.name} in stock` });
    }
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

      <ProductCardGrid products={filtered} onSelect={setSelectedProduct} onAddToCart={handleAddToCart} />
      <ProductModal
        key={selectedProduct ? selectedProduct._id : "none"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.text}
          {toast.type === "success" && <Link to="/products/cart" className="toastLink">View cart</Link>}
        </div>
      )}
    </div>
  );
};