import React, {useState} from "react"
import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"



export const Register = () => {

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")

    const register = e => {

        e.preventDefault()

        axios.post(`${SERVER_HOST}/users/register/${name}/${email}/${password}`)

        .then(res => {

            localStorage.name = res.data.name
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token

            window.location = "/"

        })

        .catch(() => setError("User already exists"))

    }

    return(

        <div>

            <h2>Register</h2>

            {error && <p>{error}</p>}

            <form onSubmit={register}>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />

                <button>Register</button>

            </form>

        </div>
    )
}