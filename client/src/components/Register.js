import React, {useState} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import {Button} from "./Button"
import {SERVER_HOST} from "../config/global_constants"
import {getCart} from "../config/cart"

export const Register = () =>
{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isRegistered, setIsRegistered] = useState(false)

    const validate = () =>
    {
        if(name.trim().length < 2) return "Name must be at least 2 characters"
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email is not valid"
        if(password.length < 8) return "Password must be at least 8 characters"
        if(password !== confirmPassword) return "Passwords do not match"
        return ""
    }

    const handleSubmit = e =>
    {
        e.preventDefault()

        const msg = validate()
        if(msg !== "")
        {
            setErrorMessage(msg)
            return
        }

        setErrorMessage("")

        // the details are sent in the request body (not in the URL)
        axios.post(`${SERVER_HOST}/api/users/register`, {name: name.trim(), email: email.trim(), password})
        .then(res =>
        {
            localStorage.name = res.data.name
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token
            setIsRegistered(true)
        })
        .catch(err =>
        {
            setErrorMessage(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Registration failed")
        })
    }

    return (
        <form className="loginCard" noValidate={true} onSubmit={handleSubmit}>
            <h2 className="loginTitle">Create an account</h2>

            {isRegistered ? <Redirect to={getCart().length > 0 ? "/products/checkout" : "/account/profile"}/> : null}

            {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

            <div className="loginField">
                <label htmlFor="registerName">Name</label>
                <input id="registerName" autoComplete="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} autoFocus/>
            </div>

            <div className="loginField">
                <label htmlFor="registerEmail">Email</label>
                <input id="registerEmail" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>

            <div className="loginField">
                <label htmlFor="registerPassword">Password</label>
                <input id="registerPassword" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)}/>
            </div>

            <div className="loginField">
                <label htmlFor="registerConfirm">Confirm password</label>
                <input id="registerConfirm" type="password" autoComplete="new-password" placeholder="Type the password again" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
            </div>

            <div className="loginActions">
                <Button value="Register" className="green-button" type="submit"/>
                <Link className="cancelButton" to="/products">Cancel</Link>
            </div>

            <div className="authHint">
                <p className="authHintText">Already have an account?</p>
                <Link className="authHintLink" to="/login">Log in here</Link>
            </div>
        </form>
    )
}
