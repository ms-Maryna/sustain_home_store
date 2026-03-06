import React from "react"
import {NavLink, Switch, Route} from "react-router-dom"
import {ProductsAdminList} from "./ProductsAdminList"
import {CustomersDashboard} from "./CustomersDashboard"
import {PurchasesDashboard} from "./PurchasesDashboard"

export const AdminPanel = () => {
    return (
        <div className="adminPanel">

            <aside className="adminSidebar">
                <h2>Admin Panel</h2>
                <NavLink exact to="/admin/products" activeClassName="activeLink">Products</NavLink>
                <NavLink exact to="/admin/customers" activeClassName="activeLink">Customers</NavLink>
                <NavLink exact to="/admin/purchases" activeClassName="activeLink">Purchases</NavLink>
            </aside>

            <section className="adminContent">
                
                    <Route exact path="/admin/products" component={ProductsAdminList}/>
                    <Route exact path="/admin/customers" component={CustomersDashboard}/>
                    <Route exact path="/admin/purchases" component={PurchasesDashboard}/>
                    <Route path="*" component={() => <h3>Select a dashboard section</h3>} />
                
            </section>

        </div>
    )
}