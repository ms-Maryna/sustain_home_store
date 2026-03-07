import React, {useState, useEffect} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const CustomerDetails = (props) => {

    const [customer, setCustomer] = useState(null)
    const [error, setError] = useState("")

    const id = props.match.params.id

    useEffect(() => {

        axios.get(`${SERVER_HOST}/api/users/${id}`, {
            headers:{authorization: localStorage.token}
        })
        .then(res => {
            setCustomer(res.data)
        })
        .catch(err => {
            setError("Failed to load customer")
        })

    }, [id])


    if(error)
    {
        return <div className="errorBox">{error}</div>
    }

    if(!customer)
    {
        return <p>Loading...</p>
    }


    return (

        <div className="customerDetails">

            <h2>Customer Details</h2>

            <div className="customerCard">

                <p><b>Name:</b> {customer.name}</p>

                <p><b>Email:</b> {customer.email}</p>

                <p><b>Access Level:</b> {customer.accessLevel}</p>

                <p><b>Phone:</b> {customer.phone || "Not provided"}</p>

                <p><b>Address:</b> {customer.address || "Not provided"}</p>

            </div>


            <h3>Purchases</h3>

            {customer.purchases && customer.purchases.length > 0 ? (

                <ul className="purchaseList">

                    {customer.purchases.map(p => (

                        <li key={p._id}>
                            Order: {p._id} — {p.total} $
                        </li>

                    ))}

                </ul>

            ) : (

                <p>No purchases yet</p>

            )}

        </div>

    )
}