import React from "react"

export const Footer = props =>
{
    const scrollToTop = () =>
    {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <footer className="siteFooter">

            <div className="footerContent">

                <div className="footerLeft">
                    <h4>Sustain Home Store</h4>
                    <p>Eco-friendly appliances for Ireland & EU</p>
                </div>

                <div className="footerCenter">
                    <p>© 2026 DKIT Group Project</p>
                    <p>Full Stack Development </p>
                </div>

                <div className="footerRight">
                    <button className="backToTop" onClick={scrollToTop}>
                        Back to top ↑
                    </button>
                </div>

            </div>

        </footer>
    )
}

