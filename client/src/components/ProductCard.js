// src/components/ProductCard.jsx
import React from "react"
import {SERVER_HOST} from "../config/global_constants"

export const ProductCard = ({product, onSelect, onAddToCart}) =>
{
    // first picture
    const main =
        product.images && product.images.length
            ? `${SERVER_HOST}/uploads/products/${product.images[0]}`
            : null

    const keyDownHandler = e =>
    {
        if(e.key === "Enter") onSelect(product)
    }

    const addHandler = e =>
    {
        e.stopPropagation()
        onAddToCart(product)
    }

    const detailsHandler = e =>
    {
        e.stopPropagation()
        onSelect(product)
    }

    return (
        <article
            className="productCard"
            onClick={() => onSelect(product)}
            role="button"
            tabIndex={0}
            onKeyDown={keyDownHandler}
        >
            <div className="productImg">
                {main ? <img src={main} alt={product.name}/> : <div className="noImg">No image</div>}
            </div>

            <div className="productBody">
                <div className="topRow">
                    <h4 className="productName">{product.name}</h4>
                    <div className="productPrice">€{product.price}</div>
                </div>

                <div className="productMeta">
                    <span className="pill">{product.category}</span>
                    {product.brand ? <span className="pill">{product.brand}</span> : null}
                </div>

                <p className="productDesc">
                    {(product.description || "").slice(0, 90)}
                    {(product.description || "").length > 90 ? "…" : ""}
                </p>

                <div className="productActions">
                    <button className="btnPrimary" onClick={addHandler}>Add to cart</button>
                    <button className="btnGhost" onClick={detailsHandler}>Details</button>
                </div>
            </div>
        </article>
    )
}