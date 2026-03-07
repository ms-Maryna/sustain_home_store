import React, {useEffect, useState} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export const PurchaseHistory = () =>
{
    const [purchases, setPurchases] = useState([])
    const [error, setError] = useState("")

    useEffect(() =>
    {
        axios.get(`${SERVER_HOST}/purchases/my`,
        {
            headers:{authorization:localStorage.token}
        })
        .then(res =>
        {
            setPurchases(res.data)
        })
        .catch(err =>
        {
            setError("Failed to load purchases")
        })

    },[])


    return(
        <div className="purchaseHistoryPage">

            <h2>Purchase History</h2>

            {error && <div className="errorBox">{error}</div>}

            <div className="purchaseGrid">

                {purchases.map(p =>

                    <div key={p._id} className="purchaseCard">

                        <div className="purchaseHeader">
                            Order #{p._id.slice(-6)}
                        </div>

                        <div className="purchaseItems">

                            {p.items.map(prod =>

                                <div key={prod._id} className="purchaseItem">

                                    <img
                                        src={`${SERVER_HOST}/uploads/products/${prod.images[0]}`}
                                        alt={prod.name}
                                    />

                                    <div>

                                        <h4>{prod.name}</h4>

                                        <p>€{prod.price}</p>

                                    </div>

                                </div>

                            )}

                        </div>

                        <div className="purchaseFooter">

                            Total: €{p.total}

                        </div>

                    </div>

                )}

            </div>

        </div>
    )
}