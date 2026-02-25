import React from "react"

export const ProductModal = props =>
{
    if(!props.product) return null

    const closeOnBackdrop = e =>
    {
        if(e.target.className === "modal-backdrop")
        {
            props.onClose()
        }
    }

    const mainImage =
        props.product.images && props.product.images.length > 0
            ? `/images/${props.product.images[0]}`
            : null

    return (
        <div className="modal-backdrop" onClick={closeOnBackdrop}>
            <div className="modal-box">
                <div className="modal-header">
                    <h3 className="modal-title">{props.product.name}</h3>
                    <button className="modal-close" onClick={props.onClose}>×</button>
                </div>

                <div className="modal-body">
                    {mainImage ? (
                        <img className="modal-image" src={mainImage} alt={props.product.name}/>
                    ) : (
                        <div className="modal-image-placeholder">No image</div>
                    )}

                    <div className="modal-info">
                        <p><b>Category:</b> {props.product.category}</p>
                        <p><b>Price:</b> €{props.product.price}</p>
                        <p><b>Stock:</b> {props.product.stock}</p>
                        <p><b>Brand:</b> {props.product.brand}</p>
                        <p><b>Energy:</b> {props.product.energyRating}</p>
                        <p><b>Condition:</b> {props.product.condition}</p>
                        <p><b>Power:</b> {props.product.powerUsage} W</p>
                        <p><b>Eco:</b> {props.product.ecoCertified ? "Yes" : "No"}</p>
                        <p><b>Description:</b> {props.product.description}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="blue-button" onClick={props.onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}


