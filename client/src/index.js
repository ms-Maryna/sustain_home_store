import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import {App} from "./App"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"


// If the login has expired (the server says "Invalid token"),
// log the user out and send them to the Login page with a message.
axios.interceptors.response.use(
    response => response,
    error =>
    {
        const message = error.response && error.response.data ? error.response.data.message : ""
        const loggedIn = parseInt(localStorage.accessLevel) > ACCESS_LEVEL_GUEST

        if(loggedIn && error.response && error.response.status === 403 && (message === "Invalid token" || message === "No token provided"))
        {
            localStorage.name = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            localStorage.token = ""
            window.location = "/login?expired=true"
        }

        return Promise.reject(error)
    }
)


ReactDOM.render(<App/>, document.getElementById(`root`))


// Register the service worker
window.addEventListener('load', () => 
{
    if ("serviceWorker" in navigator) 
    {
        navigator.serviceWorker.register("/serviceWorker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.error("Service Worker Registration Failed", err))
    }
})