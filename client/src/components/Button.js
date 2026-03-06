import React from "react"

export const Button = props =>
{
    return (
        <button type="button" className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    )
}