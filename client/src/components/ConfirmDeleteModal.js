import React from "react"

export const ConfirmDeleteModal = props =>
{
    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h3>{props.title}</h3>
                <p>{props.message}</p>

                <div className="modal-actions">
                    <button className="red-button" onClick={props.onConfirm}>Yes, delete</button>
                    <button className="grey-button" onClick={props.onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}