import React from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"

import {ACCESS_LEVEL_GUEST} from "./config/global_constants"

import {NavBar} from "./components/NavBar"
import {Footer} from "./components/Footer"

import {Home} from "./components/Home"
import {About} from "./components/About"
import {StorePage} from "./components/StorePage"
import {PayPalMessage} from "./components/PayPalMessage"

import {AddProduct} from "./components/AddProduct"
import {EditProduct} from "./components/EditProduct"
import {AdministratorRoute} from "./components/AdministratorRoute"

import {LoggedInRoute} from "./components/LoggedInRoute"
import {Login} from "./components/Login"
import {Register} from "./components/Register"
import {Logout} from "./components/Logout"

import {AdminPanel} from "./components/AdminPanel"
import {CustomerDashboard} from "./components/CustomerDashboard"

import "./css/App.css"

// create a default guest session once
if(!localStorage.getItem("accessLevel") || localStorage.getItem("accessLevel") === "undefined")
{
    localStorage.setItem("name", "GUEST")
    localStorage.setItem("accessLevel", ACCESS_LEVEL_GUEST)
    localStorage.setItem("token", "")
}
export const App = props =>
{
    return (
        <BrowserRouter>

            <NavBar/>

            <main className="pageContent">
                <Switch>

                    <Route exact path="/" component={Home}/>
                    <Route exact path="/home" component={Home}/>
                    <Route exact path="/about" component={About}/>

                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>

                    <LoggedInRoute exact path="/logout" component={Logout}/>
                    <LoggedInRoute path="/account" component={CustomerDashboard}/>

                    {/* ADMIN routes */}
                    <AdministratorRoute path="/admin" component={AdminPanel}/>
                    <AdministratorRoute exact path="/products/add" component={AddProduct}/>
                    <AdministratorRoute exact path="/products/edit/:id" component={EditProduct}/>

                    {/* STORE (cart, checkout and payment are inside StorePage) */}
                    <Route path="/products" component={StorePage}/>

                    {/* short links */}
                    <Redirect exact from="/cart" to="/products/cart"/>
                    <Redirect exact from="/checkout" to="/products/checkout"/>
                    <Redirect exact from="/payment" to="/products/payment"/>

                    <Route path="/paypal/:messageType" component={PayPalMessage}/>

                    <Route path="*" component={() => <h3>Invalid URL</h3>}/>

                </Switch>
            </main>

            <Footer/>

        </BrowserRouter>
    )
}