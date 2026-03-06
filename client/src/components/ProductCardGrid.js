import React from "react"
import {ProductCard} from "./ProductCard"

export const ProductCardGrid = ({products, onSelect, onAddToCart}) =>
{
    if(!products || products.length === 0)
    {
        return <p className="empty">No products found</p>
    }

    return (
        <div className="productGrid">
            {products.map(p =>
                <ProductCard
                    key={p._id}
                    product={p}
                    onSelect={onSelect}
                    onAddToCart={onAddToCart}
                />
            )}
        </div>
    )
}