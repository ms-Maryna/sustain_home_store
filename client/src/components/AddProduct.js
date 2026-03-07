import React, { useState } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export const AddProduct = (props) => {

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [price,setPrice] = useState("");
  const [brand,setBrand] = useState("")
const [description,setDescription] = useState("")
  const [stock,setStock] = useState("");
  const [powerUsage,setPowerUsage] = useState("");
  const [energyRating,setEnergyRating] = useState("A");
  const [condition,setCondition] = useState("new");
  const [ecoCertified,setEcoCertified] = useState(true);
  const [images,setImages] = useState([]);
  const [image,setImage] = useState([]);
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

  if(!name || !category || !brand || !price || !stock || !description || images.length === 0){
  setError("Please fill all fields and upload at least one image")
  return
}

    try{

      const formData = new FormData();

      formData.append("name",name)
formData.append("category",category)
formData.append("brand",brand)
formData.append("price",price)
formData.append("stock",stock)
formData.append("powerUsage",powerUsage)
formData.append("energyRating",energyRating)
formData.append("condition",condition)
formData.append("ecoCertified",ecoCertified)
formData.append("description",description)

      images.forEach(img=>{
        formData.append("images",img);
      });

      const token = localStorage.getItem("token");

      await axios.post(`${SERVER_HOST}/api/products`,formData,{
        headers:{
          "Content-Type":"multipart/form-data",
          "Authorization": token
        }
      });

      props.history.push("/products");

    }
    catch(err){
      setError(err.response?.data?.message || "Failed to add product");
    }
  }

  const handleImages = (e)=>{
    setImages(Array.from(e.target.files));
  }
  const handleImageChange = (e) => {

    const file = e.target.files[0]

    if(!file) return

    const allowed = ["image/png","image/jpeg","image/jpg"]

    if(!allowed.includes(file.type)){
        alert("Only PNG or JPG images allowed")
        return
    }

    setImage(file)
}

  return(

    <div className="adminPanel">

      <h2>Add Product</h2>

      {error && <div className="errorBox">{error}</div>}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <select
 value={category}
 onChange={e=>setCategory(e.target.value)}
>
<option value="">Select Category</option>
<option value="Kitchen">Kitchen</option>
<option value="Air">Air</option>
<option value="Cleaning">Cleaning</option>
<option value="Laundry">Laundry</option>
<option value="Energy">Energy</option>
</select>
<input
  type="text"
  placeholder="Brand (Samsung, LG, etc)"
  value={brand}
  onChange={e=>setBrand(e.target.value)}
/>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e=>setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e=>setStock(e.target.value)}
        />

        <input
          type="number"
          placeholder="Power Usage"
          value={powerUsage}
          onChange={e=>setPowerUsage(e.target.value)}
        />
<textarea
  placeholder="Example: High efficiency air purifier with HEPA filter and smart control"
  value={description}
  onChange={e=>setDescription(e.target.value)}
  minLength="10"
/>

        <select
          value={energyRating}
          onChange={e=>setEnergyRating(e.target.value)}
        >
          {["A","B","C","D","E","F","G"].map(r=>
            <option key={r} value={r}>{r}</option>
          )}
        </select>

        <select
          value={condition}
          onChange={e=>setCondition(e.target.value)}
        >
          {["new","used","refurbished"].map(c=>
            <option key={c} value={c}>{c}</option>
          )}
        </select>

        <label>
          Eco Certified
          <input
            type="checkbox"
            checked={ecoCertified}
            onChange={e=>setEcoCertified(e.target.checked)}
          />
        </label>

        <input
          type="file"
          multiple
          onChange={handleImages}
        />
                <input type="file" onChange={handleImageChange} />
                

        <button type="submit">
          Add Product
        </button>

      </form>

    </div>

  )

}