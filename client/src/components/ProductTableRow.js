import React from "react"

export const ProductTableRow = props =>
{
    return (
    <tr>
        <td>{props.product.name}</td>
        <td>{props.product.category}</td>
        <td>{props.product.price}</td>
        <td>{props.product.stock}</td>
    </tr>
    )
}
