import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import axios from "axios"

import {ProductTable} from "./ProductTable"
import {SERVER_HOST} from "../config/global_constants"

export const DisplayAllProducts = props =>
{
    const [products, setProducts] = useState([])

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/products`)
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
                    console.log("Records read")
                    setProducts(res.data)
                }
            }
            else
            {
                console.log("Records not found")
            }
        })
    }, [])

    return (
    <div className="form-container">

        <div className="table-container">
            <ProductTable products={products} />

            <div className="add-new-product">
                <Link className="blue-button" to={"/add-product"}>Add Product</Link>
            </div>
        </div>

    </div>
    )
}