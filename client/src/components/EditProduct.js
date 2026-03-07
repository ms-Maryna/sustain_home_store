import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const EditProduct = (props) => {

  const productId = props.match.params.id;

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [price,setPrice] = useState("");
  const [stock,setStock] = useState("");
  const [powerUsage,setPowerUsage] = useState("");
  const [energyRating,setEnergyRating] = useState("A");
  const [condition,setCondition] = useState("new");
  const [ecoCertified,setEcoCertified] = useState(true);
  const [error,setError] = useState("");

  useEffect(()=>{

    axios.get(`${SERVER_HOST}/api/products/${productId}`)
    .then(res=>{
      const p = res.data;

      setName(p.name);
      setCategory(p.category);
      setPrice(p.price);
      setStock(p.stock);
      setPowerUsage(p.powerUsage);
      setEnergyRating(p.energyRating);
      setCondition(p.condition);
      setEcoCertified(p.ecoCertified);
    })
    .catch(()=>{
      setError("Failed to load product");
    })

  },[productId])

  const handleSubmit = async (e)=>{

    e.preventDefault();

    try{

      const token = localStorage.getItem("token");

      await axios.put(`${SERVER_HOST}/api/products/${productId}`,{

        name,
        category,
        price,
        stock,
        powerUsage,
        energyRating,
        condition,
        ecoCertified

      },{
        headers:{
          Authorization: token
        }
      })

      props.history.push("/products")

    }
    catch(err){
      setError(err.response?.data?.message || "Update failed")
    }

  }

  return(

    <div className="adminPanel">

      <h2>Edit Product</h2>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>

        <input value={name} onChange={e=>setName(e.target.value)} />

        <input value={category} onChange={e=>setCategory(e.target.value)} />

        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />

        <input type="number" value={stock} onChange={e=>setStock(e.target.value)} />

        <button type="submit">
          Update Product
        </button>

      </form>

    </div>

  )

}