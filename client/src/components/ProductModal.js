import React, {useState} from "react"
import {SERVER_HOST} from "../config/global_constants"

export const ProductModal = props =>
{
    const [imgIndex, setImgIndex] = useState(0)

    if(!props.product) return null

    const closeOnBackdrop = e =>
    {
        if(e.target.className === "modal-backdrop")
        {
            props.onClose()
        }
    }

    const images = (props.product.images && props.product.images.length > 0)
        ? props.product.images
        : []

    // reset index if product changes or images shorter
    let safeIndex = imgIndex
    if(safeIndex >= images.length) safeIndex = 0

    const showPrev = () =>
    {
        if(images.length < 2) return
        const next = safeIndex - 1
        setImgIndex(next < 0 ? images.length - 1 : next)
    }

    const showNext = () =>
    {
        if(images.length < 2) return
        const next = safeIndex + 1
        setImgIndex(next >= images.length ? 0 : next)
    }

    const mainImageUrl = images.length > 0
        ? `${SERVER_HOST}/uploads/products/${images[safeIndex]}`
        : null

    return (
        <div className="modal-backdrop" onClick={closeOnBackdrop}>
            <div className="modal-box">
                <div className="modal-header">
                    <h3 className="modal-title">{props.product.name}</h3>
                    <button className="modal-close" onClick={props.onClose}>×</button>
                </div>

                <div className="modal-body">
                    {mainImageUrl ? (
                        <div className="modal-image-wrap">
                            <img className="modal-image" src={mainImageUrl} alt={props.product.name}/>

                            {images.length > 1 ? (
                                <div className="modal-arrows">
                                    <button type="button" className="arrow-btn" onClick={showPrev}>‹</button>
                                    <button type="button" className="arrow-btn" onClick={showNext}>›</button>
                                </div>
                            ) : null}

                            {images.length > 1 ? (
                                <div className="modal-thumbs">
                                    {images.map((fn, i) =>
                                    (
                                        <img
                                            key={i}
                                            className={i === safeIndex ? "thumb thumb-active" : "thumb"}
                                            src={`${SERVER_HOST}/uploads/products/${fn}`}
                                            alt=""
                                            onClick={() => setImgIndex(i)}
                                            
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </div>
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