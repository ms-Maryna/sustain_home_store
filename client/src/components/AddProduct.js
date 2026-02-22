import React, {useState} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export const AddProduct = props =>
{
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [energyRating, setEnergyRating] = useState("")
    const [brand, setBrand] = useState("")
    const [condition, setCondition] = useState("")
    const [powerUsage, setPowerUsage] = useState("")
    const [ecoCertified, setEcoCertified] = useState(false)
    const [images, setImages] = useState("")
    const [description, setDescription] = useState("")
    const [redirectToDisplayAllProducts, setRedirectToDisplayAllProducts] = useState(false)


    const handleNameChange = e => { setName(e.target.value) }
    const handleCategoryChange = e => { setCategory(e.target.value) }
    const handlePriceChange = e => { setPrice(e.target.value) }
    const handleStockChange = e => { setStock(e.target.value) }
    const handleEnergyRatingChange = e => { setEnergyRating(e.target.value) }
    const handleBrandChange = e => { setBrand(e.target.value) }
    const handleConditionChange = e => { setCondition(e.target.value) }
    const handlePowerUsageChange = e => { setPowerUsage(e.target.value) }
    const handleEcoCertifiedChange = e => { setEcoCertified(e.target.checked) }
    const handleImagesChange = e => { setImages(e.target.value) }
    const handleDescriptionChange = e => { setDescription(e.target.value) }


    const handleSubmit = e =>
    {
        e.preventDefault()

        const imagesArray = images.split(",").map(s => s.trim()).filter(s => s.length > 0)

        const productObject =
        {
            name: name,
            category: category,
            price: Number(price),
            stock: Number(stock),
            energyRating: energyRating,
            brand: brand,
            condition: condition,
            powerUsage: Number(powerUsage),
            ecoCertified: ecoCertified,
            images: imagesArray,
            description: description
        }

        axios.post(`${SERVER_HOST}/products`, productObject)
        .then(res =>
        {
            if(res.data)
            {
                if(res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)
                }
                else
                {
                    console.log("Record added")
                    setRedirectToDisplayAllProducts(true)
                }
            }
            else
            {
                console.log("Record not added")
            }
        })
    }


    return (
    <div className="form-container">
        {redirectToDisplayAllProducts ? <Redirect to="/products"/> : null}

        <h3>Add Product</h3>

        <form onSubmit={handleSubmit}>
            <div>
                <label>Name: </label>
                <input value={name} onChange={handleNameChange}/>
            </div>

            <div>
                <label>Category: </label>
                <input value={category} onChange={handleCategoryChange}/>
            </div>

            <div>
                <label>Price: </label>
                <input value={price} onChange={handlePriceChange}/>
            </div>

            <div>
                <label>Stock: </label>
                <input value={stock} onChange={handleStockChange}/>
            </div>

            <div>
                <label>Energy Rating: </label>
                <input value={energyRating} onChange={handleEnergyRatingChange}/>
            </div>

            <div>
                <label>Brand: </label>
                <input value={brand} onChange={handleBrandChange}/>
            </div>

            <div>
                <label>Condition: </label>
                <input value={condition} onChange={handleConditionChange}/>
            </div>

            <div>
                <label>Power Usage: </label>
                <input value={powerUsage} onChange={handlePowerUsageChange}/>
            </div>

            <div>
                <label>Eco Certified: </label>
                <input type="checkbox" checked={ecoCertified} onChange={handleEcoCertifiedChange}/>
            </div>

            <div>
                <label>Images (comma separated): </label>
                <input value={images} onChange={handleImagesChange}/>
            </div>

            <div>
                <label>Description: </label>
                <input value={description} onChange={handleDescriptionChange}/>
            </div>

            <button type="submit">Submit</button>

            <Link to="/products">
                <button type="button">Cancel</button>
            </Link>
        </form>
    </div>
    )
}