
import { Link, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react"

import {
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
  ACCESS_LEVEL_GUEST
} from "../config/global_constants";

export const NavBar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // accessLevel




const [accessLevel, setAccessLevel] = useState(
  Number(localStorage.getItem("accessLevel")) || ACCESS_LEVEL_GUEST
)

useEffect(() => {
  setAccessLevel(Number(localStorage.getItem("accessLevel")))
}, [])

  return (
    <header className="siteHeader">
      <div className="navInner">

        {/* LOGO */}
        <div className="brandWrap">
          <div className="brandLogo">SH</div>
          <div className="brandText">Sustain Home Store</div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="burger" onClick={toggleMenu} aria-label="Menu">
          ☰
        </button>

        <nav className={menuOpen ? "navLinks open" : "navLinks"}>

          {/* CENTER MENU */}
          <div className="navCenter">

      <NavLink
  to="/home"
  exact
  onClick={closeMenu}
  className="navItem"
  activeClassName="active"
>
  Home
</NavLink>

            <span className="navDivider">|</span>

       <NavLink
  to="/about"
  exact
  onClick={closeMenu}
  className="navItem"
  activeClassName="active"
>
  About
</NavLink>

            <span className="navDivider">|</span>

       <NavLink
  to="/products"
  exact
  onClick={closeMenu}
  className="navItem"
  activeClassName="active"
>
  Store
</NavLink>

 <NavLink
  to="/login"
  exact
  onClick={closeMenu}
  className="navButton"
  activeClassName="active"
>
  Login
</NavLink>

            {/* USER ACCOUNT */}
            {accessLevel === ACCESS_LEVEL_NORMAL_USER && (
              <>
                <span className="navDivider">|</span>

             <NavLink
  to="/account"
  exact
  onClick={closeMenu}
  className="navItem"
  activeClassName="active"
>
  My Account
</NavLink>
              </>
            )}

          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="navRight">

            {/* ADMIN */}
            {accessLevel === ACCESS_LEVEL_ADMIN && (
              <>
                <NavLink
                  className="navButton"
                  to="/admin"
                  onClick={closeMenu}
                >
                  Admin Panel
                </NavLink>

                <NavLink
                  className="navButton"
                  to="/logout"
                  onClick={closeMenu}
                >
                  Logout
                </NavLink>
              </>
            )}

            {/* GUEST */}
            {accessLevel === ACCESS_LEVEL_GUEST && (
              <>
           
                <Link
                  className="navButton"
                  to="/products"
                  onClick={closeMenu}
                >
                  Order Online
                </Link>
              </>
            )}

            {/* USER */}
            {accessLevel === ACCESS_LEVEL_NORMAL_USER && (
              <NavLink
                className="navButton"
                to="/logout"
                onClick={closeMenu}
              >
                Logout
              </NavLink>
            )}

          </div>

        </nav>
      </div>
    </header>
  );
};