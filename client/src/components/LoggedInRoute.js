import React from "react"
import {Route, Redirect} from "react-router-dom"

export const LoggedInRoute = ({component:Component, ...rest}) => {

    return (

        <Route
            {...rest}

            render={props =>

                parseInt(localStorage.accessLevel) > 0 ?

                <Component {...props}/>

                :

                <Redirect to="/login"/>

            }

        />

    )
}