import React from "react"
import {SERVER_HOST} from "../config/global_constants"

export const Home = props =>
{
    const heroUrl = `${SERVER_HOST}/uploads/hero-home.jpg`

    return (
        <div
            className="homeHero"
            style={{backgroundImage: `url(${heroUrl})`}}
        >
            <div className="homeGlassCircle">
                <h1>Welcome to our store</h1>
                <p>Eco-friendly appliances for the Irish and EU market.</p>
            </div>
        </div>
    )
}