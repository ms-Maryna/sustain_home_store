import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants"; // убедись, что это 2

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const accessLevel = parseInt(localStorage.accessLevel, 10); // берём число из localStorage

  return (
    <header className="siteHeader">
      <div className="navInner">
        {/* BRAND */}
        <div className="brandWrap">
          <div className="brandLogo">SH</div>
          <div className="brandText">Sustain Home Store</div>
        </div>

        <button className="burger" onClick={toggleMenu} aria-label="Menu">
          ☰
        </button>

        <nav className={menuOpen ? "navLinks open" : "navLinks"}>
          {/* CENTER MENU */}
          <div className="navCenter">
            <NavLink className="navItem" activeClassName="active" to="/home" onClick={closeMenu}>
              Home
            </NavLink>
            <span className="navDivider">|</span>
            <NavLink className="navItem" activeClassName="active" to="/about" onClick={closeMenu}>
              About
            </NavLink>
            <span className="navDivider">|</span>
            <NavLink className="navItem" activeClassName="active" to="/products" onClick={closeMenu}>
              Store
            </NavLink>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="navRight">
            {accessLevel === ACCESS_LEVEL_ADMIN && (
              <>
                <NavLink className="navButton" to="/admin" onClick={closeMenu}>
                  Admin Panel
                </NavLink>
                <NavLink className="navButton" to="/logout" onClick={closeMenu}>
                  Logout
                </NavLink>
              </>
            )}

            {accessLevel !== ACCESS_LEVEL_ADMIN && (
              <>
                <Link className="navButton" to="/login" onClick={closeMenu}>
                  Login
                </Link>
                <Link className="navButton" to="/products" onClick={closeMenu}>
                  Order Online
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};