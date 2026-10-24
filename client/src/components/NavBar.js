import React, {useState} from "react"
import {Link, NavLink, useLocation} from "react-router-dom"

import {
    ACCESS_LEVEL_ADMIN,
    ACCESS_LEVEL_NORMAL_USER,
    ACCESS_LEVEL_GUEST
} from "../config/global_constants"

export const NavBar = () =>
{
    const [menuOpen, setMenuOpen] = useState(false)

    // useLocation makes the NavBar re-render on every page change,
    // so after Login / Logout the correct buttons are shown straight away
    useLocation()

    const accessLevel = parseInt(localStorage.getItem("accessLevel")) || ACCESS_LEVEL_GUEST

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="siteHeader">
            <div className="navInner">

                {/* LOGO */}
                <Link to="/home" className="brandWrap" onClick={closeMenu}>
                    <div className="brandLogo">SH</div>
                    <div className="brandText">Sustain Home Store</div>
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button className="burger" onClick={toggleMenu} aria-label="Menu" aria-expanded={menuOpen}>
                    ☰
                </button>

                <nav className={menuOpen ? "navLinks open" : "navLinks"}>

                    {/* CENTER MENU */}
                    <div className="navCenter">

                        <NavLink to="/home" exact onClick={closeMenu} className="navItem" activeClassName="active">Home</NavLink>

                        <span className="navDivider">|</span>

                        <NavLink to="/about" exact onClick={closeMenu} className="navItem" activeClassName="active">About</NavLink>

                        <span className="navDivider">|</span>

                        <NavLink to="/products" onClick={closeMenu} className="navItem" activeClassName="active">Store</NavLink>

                        {accessLevel === ACCESS_LEVEL_NORMAL_USER ?
                            <>
                                <span className="navDivider">|</span>
                                <NavLink to="/account" onClick={closeMenu} className="navItem" activeClassName="active">My Account</NavLink>
                            </>
                        : null}

                    </div>

                    {/* RIGHT SIDE BUTTONS */}
                    <div className="navRight">

                        {/* GUEST: only Login (no Logout) */}
                        {accessLevel === ACCESS_LEVEL_GUEST ?
                            <>
                                <NavLink to="/login" exact onClick={closeMenu} className="navButton" activeClassName="active">Login</NavLink>
                                <Link className="navButton" to="/products" onClick={closeMenu}>Order Online</Link>
                            </>
                        : null}

                        {/* ADMIN */}
                        {accessLevel === ACCESS_LEVEL_ADMIN ?
                            <NavLink className="navButton" to="/admin" onClick={closeMenu}>Admin Panel</NavLink>
                        : null}

                        {/* USER and ADMIN: only Logout (no Login) */}
                        {accessLevel > ACCESS_LEVEL_GUEST ?
                            <NavLink className="navButton" to="/logout" onClick={closeMenu}>Logout</NavLink>
                        : null}

                    </div>

                </nav>
            </div>
        </header>
    )
}
