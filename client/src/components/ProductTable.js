import React from "react"
import {ProductTableRow} from "./ProductTableRow"

export const ProductTable = props =>
{
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
            </thead>

            <tbody>
                {props.products.map(p =>
                    <ProductTableRow
                        key={p._id}
                        product={p}
                        onSelect={props.onSelect}   
                    />
                )}
            </tbody>
        </table>
    )
}