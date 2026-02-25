import React from "react"

export const ProductTableRow = props =>
{
    return (
        <tr 
            onClick={() => props.onSelect(props.product)} 
            style={{cursor:"pointer"}}
        >
            <td>{props.product.name}</td>
            <td>{props.product.category}</td>
            <td>{props.product.price}</td>
            <td>{props.product.stock}</td>
        </tr>
    )
}