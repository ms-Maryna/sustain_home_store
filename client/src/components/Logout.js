import React, {useEffect} from "react"

export const Logout = () => {

    useEffect(() => {

        localStorage.clear()

        window.location = "/"

    }, [])

    return <h2>Logging out...</h2>
}