import React from "react"
import {Switch, Route} from "react-router-dom"

import {StoreMenu} from "./StoreMenu"
import {DisplayAllProducts} from "./DisplayAllProducts"
import {Cart} from "./Cart"
import {Checkout} from "./Checkout"
import {Payment} from "./Payment"

export const StorePage = props =>
{
    return (
        <div className="storePage">

            <StoreMenu/>

            <Switch>
                <Route exact path="/products" component={DisplayAllProducts}/>
                <Route exact path="/products/cart" component={Cart}/>
                <Route exact path="/products/checkout" component={Checkout}/>
                <Route exact path="/products/payment" component={Payment}/>

                <Route path="*" component={() => <h3>Invalid Store URL</h3>}/>
            </Switch>
        </div>
    )
}
