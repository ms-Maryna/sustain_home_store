import React from "react"
import {Switch, Route} from "react-router-dom"

import {StoreMenu} from "./StoreMenu"
import {DisplayAllProducts} from "./DisplayAllProducts"
import {Cart} from "./Cart"
import {Checkout} from "./Checkout"

import {AddProduct} from "./AddProduct"
import {EditProduct} from "./EditProduct"

import {AdministratorRoute} from "./AdministratorRoute"

export const StorePage = props =>
{
    return (
        <div className="storePage">

            <StoreMenu />

            <Switch>
                <Route exact path="/products" component={DisplayAllProducts}/>
                <Route exact path="/products/cart" component={Cart}/>
                <Route exact path="/products/checkout" component={Checkout}/>

                <AdministratorRoute exact path="/products/add" component={AddProduct}/>
                <AdministratorRoute exact path="/products/edit/:id" component={EditProduct}/>

                <Route path="*" component={() => <h3>Invalid Store URL</h3>}/>
            </Switch>
        </div>
    )
}