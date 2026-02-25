import React, {useState, useEffect} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const DisplayProduct = props =>
{
    const [product, setProduct] = useState(null)

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/products/${props.match.params.id}`)
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
                    setProduct(res.data)
                }
            }
            else
            {
                console.log("Record not found")
            }
        })
        .catch(err => console.log(`${err.response ? err.response.data : err.message}\n${err}`))
    }, [props.match.params.id])


    if(!product)
    {
        return <h3>Loading...</h3>
    }


    return (
    <div className="form-container">
        <h3>{product.name}</h3>

        <div style={{marginBottom:"15px"}}>
            {product.images && product.images.map((img, index) =>
                <img
                    key={index}
                    src={`/images/${img}`}
                    alt={product.name}
                    style={{width:"160px", marginRight:"10px", marginBottom:"10px"}}
                />
            )}
        </div>

        <p><b>Category:</b> {product.category}</p>
        <p><b>Price:</b> €{product.price}</p>
        <p><b>Stock:</b> {product.stock}</p>
        <p><b>Brand:</b> {product.brand}</p>
        <p><b>Energy Rating:</b> {product.energyRating}</p>
        <p><b>Condition:</b> {product.condition}</p>
        <p><b>Power Usage:</b> {product.powerUsage} W</p>
        <p><b>Eco Certified:</b> {product.ecoCertified ? "Yes" : "No"}</p>
        <p><b>Description:</b> {product.description}</p>
    </div>
    )
}