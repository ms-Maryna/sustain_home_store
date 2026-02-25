import React from "react"
import {BrowserRouter, Switch, Route, Link} from "react-router-dom"
import {DisplayAllProducts} from "./components/DisplayAllProducts"
import {DisplayProduct} from "./components/DisplayProduct"
import {Home} from "./components/Home"
import {About} from "./components/About"
import {AddProduct} from "./components/AddProduct"


import "./css/App.css"

export const App = props =>
{
    return (
    <BrowserRouter>
        <header>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Products</Link>
        </header>

        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/about" component={About}/>

            <Route exact path="/product/:id" component={DisplayProduct}/>
            <Route exact path="/products" component={DisplayAllProducts}/>
            <Route exact path="/add-product" component={AddProduct}/>

            <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>}/>
        </Switch>

        <footer>
            Footer
        </footer>
    </BrowserRouter>
    )
}