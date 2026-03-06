import React from "react"
import {SERVER_HOST} from "../config/global_constants"

export const About = props =>
{
    const ecoHome = `${SERVER_HOST}/uploads/eco-home.png`
    const energy = `${SERVER_HOST}/uploads/energy-efficient.png`
    const euMarket = `${SERVER_HOST}/uploads/eu-market.png`

    return (
        <div className="about-container">
            <div className="about-wrap">

                <div className="about-head">
                    <h1>About SustainHome</h1>
                    <p>
                        We help customers choose eco-friendly appliances that save energy, reduce waste,
                        and feel good to use every day. Simple choices can make a real difference.
                    </p>
                </div>

                <section className="about-section">
                    <div className="about-text">
                        <h2>Sustainable Living, Made Simple</h2>
                        <p>
                            SustainHome Store is a small, friendly place to find appliances that support a
                            greener lifestyle. We focus on quality, practicality, and clear product details.
                        </p>
                    </div>
                    <div className="about-image">
                        <img src={ecoHome} alt="Eco home"/>
                    </div>
                </section>

                <section className="about-section reverse">
                    <div className="about-image">
                        <img src={energy} alt="Energy efficient appliances"/>
                    </div>
                    <div className="about-text">
                        <h2>Energy Ratings You Can Trust</h2>
                        <p>
                            Each product includes energy rating, power usage, and helpful information,
                            so you can compare items quickly and choose what fits your home best.
                        </p>
                    </div>
                </section>

                <section className="about-section">
                    <div className="about-text">
                        <h2>Designed for Ireland & the EU</h2>
                        <p>
                            Our store focuses on appliances that match EU standards and real daily needs.
                            We want shopping to feel easy, calm, and confident.
                        </p>
                    </div>
                    <div className="about-image">
                        <img src={euMarket} alt="EU market"/>
                    </div>
                </section>

            </div>
        </div>
    )
}