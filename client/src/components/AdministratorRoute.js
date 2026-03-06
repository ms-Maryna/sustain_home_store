import React from "react"
import {Route, Redirect} from "react-router-dom"

export const AdministratorRoute = ({component:Component, ...rest}) => {

    return (

        <Route
            {...rest}

            render={props =>

                parseInt(localStorage.accessLevel) === 2 ?

                <Component {...props}/>

                :

                <Redirect to="/login"/>

            }

        />

    )
}