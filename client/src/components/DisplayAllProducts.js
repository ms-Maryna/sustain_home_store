import React, {useState, useEffect} from "react"
import axios from "axios"
import {ProductTable} from "./ProductTable"
import {SERVER_HOST} from "../config/global_constants"
import {ProductModal} from "./ProductModal"

export const DisplayAllProducts = props =>
{
    const [products, setProducts] = useState([])

    const [searchText, setSearchText] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortOption, setSortOption] = useState("name")
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() =>
{
    axios.get(`${SERVER_HOST}/products`)
    .then(res =>
    {
        if(res.data)
        {
            setProducts(res.data)
        }
        else
        {
            console.log("No records found")
        }
    })
    .catch(err => console.log(`${err.response ? err.response.data : err.message}\n${err}`))
}, [])
    const handleSearchChange = e =>
    {
        setSearchText(e.target.value)
    }

    const handleCategoryChange = e =>
    {
        setSelectedCategory(e.target.value)
    }

    const handleSortChange = e =>
    {
        setSortOption(e.target.value)
    }


    // -------- SEARCH + FILTER + SORT --------

    let filteredProducts = products

    // FILTER
    if(selectedCategory !== "All")
    {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory)
    }

    // SEARCH
    if(searchText.trim() !== "")
    {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchText.toLowerCase())
        )
    }

    // SORT
    if(sortOption === "name")
    {
        filteredProducts = [...filteredProducts].sort((a,b) =>
            a.name.localeCompare(b.name)
        )
    }
    else if(sortOption === "priceLow")
    {
        filteredProducts = [...filteredProducts].sort((a,b) =>
            a.price - b.price
        )
    }
    else if(sortOption === "priceHigh")
    {
        filteredProducts = [...filteredProducts].sort((a,b) =>
            b.price - a.price
        )
    }

    // GET UNIQUE CATEGORIES
    const categories = ["All"]
    products.forEach(p =>
    {
        if(!categories.includes(p.category))
        {
            categories.push(p.category)
        }
    })


    return (
        <div className="form-container">

            <h3>Products</h3>

            <div style={{marginBottom:"15px"}}>

                <label>Search: </label>
                <input value={searchText} onChange={handleSearchChange} />

                <span style={{marginLeft:"15px"}}></span>

                <label>Category: </label>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    {categories.map(c =>
                        <option key={c} value={c}>{c}</option>
                    )}
                </select>

                <span style={{marginLeft:"15px"}}></span>

                <label>Sort: </label>
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="name">Name A/Z</option>
                    <option value="priceLow">Price Low-high</option>
                    <option value="priceHigh">Price High-low</option>
                </select>

            </div>

            <div className="table-container">
                <ProductTable products={filteredProducts} onSelect={setSelectedProduct}/>
                
            </div>
                {selectedProduct ? <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)}/> : null}
            </div>

        
    )
}