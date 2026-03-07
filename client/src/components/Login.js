import React, { useState } from "react"
import { Redirect, Link } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/Button"
import { SERVER_HOST, ACCESS_LEVEL_GUEST } from "../config/global_constants"

if (typeof localStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

export const Login = props => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleEmailChange = e => setEmail(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)

    const handleSubmit = e => {
        e.preventDefault()
        setErrorMessage("")

        axios.post(
            `${SERVER_HOST}/api/users/login/${encodeURIComponent(email)}/${encodeURIComponent(password)}`
        )
        .then(res => {
            localStorage.name = res.data.name
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token
             setIsLoggedIn(true)
        })
        .catch(err => {
            if (err.response && err.response.data) {
                const msg = err.response.data.message || "Login failed"
                setErrorMessage(msg)
            } else {
                setErrorMessage("Login failed")
            }
        })
    }

    return (
        <form className="loginCard" noValidate={true} id="loginOrRegistrationForm" onSubmit={handleSubmit}>
            <h2 className="loginTitle">Login</h2>

            {isLoggedIn && <Redirect to="/products" />}

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="loginField">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    autoFocus
                />
            </div>

            <div className="loginField">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>

            <div className="loginActions">
                <Button value="Login" className="green-button" type="submit" />
                <Link className="cancelButton" to="/products">Cancel</Link>
            </div>

            <div className="authHint">
                <p className="authHintText">
                    New customer? Create an account to save your profile and view purchase history.
                </p>

                <Link className="authHintLink" to="/register">
                    Register here
                </Link>

                <p className="authHintSmall">
                    Guest customers can still order online without registering.
                </p>

                <Link className="guestCheckoutButton" to="/checkout">
                    Checkout as Guest
                </Link>
            </div>
        </form>
    )
}