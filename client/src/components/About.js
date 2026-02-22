import React, {useState} from "react"
import {Redirect} from 'react-router-dom'


export const About = props =>
{
    const [redirectToHome, setRedirectToHome] = useState(false)

    const clickHandler = e =>
    {

        setRedirectToHome(true)
    }

    return (
    <div>
        {redirectToHome ? <Redirect to="/home"/> : null}
        <h3>About</h3>
        <input type="button" value="Save" onClick={clickHandler} />
    </div>
    )
}