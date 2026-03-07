import React from "react"
import {NavLink, Switch, Route} from "react-router-dom"

import {ProductsAdminList} from "./ProductsAdminList"
import {CustomersDashboard} from "./CustomersDashboard"
import {PurchasesDashboard} from "./PurchasesDashboard"
import {CustomerDetails} from "./CustomerDetails"

export const AdminPanel = () => {

    return(

        <div className="adminPanel">

            <aside className="adminSidebar">

                <h2>Admin Panel</h2>

                <NavLink to="/admin/products">Products</NavLink>
                <NavLink to="/admin/customers">Customers</NavLink>
                <NavLink to="/admin/purchases">Purchases</NavLink>

            </aside>

            <section className="adminContent">

                <Switch>

                    <Route exact path="/admin/products" component={ProductsAdminList}/>
                    <Route exact path="/admin/customers" component={CustomersDashboard}/>
                    <Route exact path="/admin/purchases" component={PurchasesDashboard}/>
                    
                    
                    <Route path="/admin/customers/:id" component={CustomerDetails}/>


                    <Route path="/admin" component={()=><h3>Select dashboard</h3>} />

                </Switch>

            </section>

        </div>

    )

}