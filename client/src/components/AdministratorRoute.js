import React from "react"
import {Route, Redirect} from "react-router-dom"

export const AdministratorRoute = ({component:Component, ...rest}) => {

    return(

        <Route
            {...rest}
            render={props => {

                const accessLevel = parseInt(localStorage.getItem("accessLevel"))

                if(accessLevel===2){
                    return <Component {...props}/>
                }

                return <Redirect to="/login"/>

            }}
        />

    )

}