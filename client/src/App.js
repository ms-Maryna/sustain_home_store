import React from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"

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
import {Profile} from "./components/Profile"
import {PurchaseHistory} from "./components/PurchaseHistory"

import {AdminPanel} from "./components/AdminPanel"
import {ProductsAdminList} from "./components/ProductsAdminList"
import {CustomersDashboard} from "./components/CustomersDashboard"
import {CustomerDashboard} from "./components/CustomerDashboard"
import {PurchasesDashboard} from "./components/PurchasesDashboard"
import {Cart} from "./components/Cart"
import {Checkout} from "./components/Checkout"
import {Payment} from "./components/Payment"



import "./css/App.css"

// create default session once (AFTER imports)
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

                    <AdministratorRoute  path="/admin" component={AdminPanel}/>
                  <AdministratorRoute path="/products/add" component={AddProduct}/>
                    <AdministratorRoute  path="/products/edit/:id" component={EditProduct}/>

                    {/* STORE */}

                    <Route path="/products" component={StorePage}/>
                   
                    <Route exact path="/cart" component={Cart}/>
                    <Route exact path="/payment" component={Payment}/>

                    <Route exact path="/checkout" component={Checkout}/>


                    <Route path="/paypal/:messageType" component={PayPalMessage}/>

                    <Route path="*" component={() => <h3>Invalid URL</h3>}/>

                </Switch>
            </main>

            <Footer/>

        </BrowserRouter>
    )
}