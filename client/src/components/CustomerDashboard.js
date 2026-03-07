import React from "react"
import {Switch, Route, NavLink} from "react-router-dom"

import {Profile} from "./Profile"
import {PurchaseHistory} from "./PurchaseHistory"
import {ReturnProducts} from "./ReturnProducts"

export const CustomerDashboard = () =>
{
    return (
        <div className="customerDashboard">

            <h1 className="dashboardTitle">My Account</h1>

            <nav className="dashboardMenu">

                <NavLink
                    to="/account/profile"
                    className="dashboardLink"
                    activeClassName="active"
                >
                    Profile
                </NavLink>

                <NavLink
                    to="/account/history"
                    className="dashboardLink"
                    activeClassName="active"
                >
                    Purchase History
                </NavLink>

                <NavLink
                    to="/account/returns"
                    className="dashboardLink"
                    activeClassName="active"
                >
                    Return Products
                </NavLink>

            </nav>

            <div className="dashboardContent">

                <Switch>

                    <Route exact path="/account">
                        <h2>Welcome to your account</h2>
                    </Route>

                    <Route path="/account/profile" component={Profile}/>

                    <Route path="/account/history" component={PurchaseHistory}/>

                    <Route path="/account/returns" component={ReturnProducts}/>

                </Switch>

            </div>

        </div>
    )
}