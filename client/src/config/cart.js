// Helper functions for the shopping cart.
// The cart is saved in localStorage so it stays after a page refresh.
//
// IMPORTANT: the price saved here is ONLY used to show the price on the screen.
// The server never trusts it - it reads the real price from the database
// when the order is created (see server/routes/purchases.js).

import axios from "axios"
import {SERVER_HOST} from "./global_constants"

const CART_KEY = "cart"

// other components (for example the cart counter) listen to this event
const CART_EVENT = "cartChanged"


export const getCart = () =>
{
    try
    {
        const cart = JSON.parse(localStorage.getItem(CART_KEY))
        return Array.isArray(cart) ? cart : []
    }
    catch(e)
    {
        return []
    }
}


export const saveCart = items =>
{
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event(CART_EVENT))
}


export const clearCart = () => saveCart([])


export const getCartCount = () => getCart().reduce((sum, item) => sum + item.qty, 0)


export const onCartChange = callback =>
{
    window.addEventListener(CART_EVENT, callback)
    window.addEventListener("storage", callback) // cart changed in another tab
    return () =>
    {
        window.removeEventListener(CART_EVENT, callback)
        window.removeEventListener("storage", callback)
    }
}


// Adds one product. Returns false if there is no more stock.
export const addToCart = product =>
{
    const cart = getCart()
    const item = cart.find(i => i._id === product._id)
    const inCart = item ? item.qty : 0

    if(inCart >= product.stock) return false

    if(item)
    {
        item.qty = item.qty + 1
    }
    else
    {
        cart.push(
        {
            _id: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: product.images && product.images.length > 0 ? product.images[0] : "",
            qty: 1
        })
    }

    saveCart(cart)
    return true
}


// Loads the newest products from the server and updates the cart with the real
// name, price and stock. Products that were deleted are removed.
// Returns {items, changed} - changed is true if something in the cart was updated.
export const refreshCart = () =>
{
    return axios.get(`${SERVER_HOST}/api/products`)
    .then(res =>
    {
        const products = res.data
        let changed = false

        const items = getCart()
            .map(item =>
            {
                const product = products.find(p => p._id === item._id)

                if(!product || product.stock === 0)
                {
                    changed = true
                    return null
                }

                const qty = Math.min(item.qty, product.stock)

                if(qty !== item.qty || product.price !== item.price || product.name !== item.name)
                {
                    changed = true
                }

                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    image: product.images && product.images.length > 0 ? product.images[0] : "",
                    qty: qty
                }
            })
            .filter(item => item !== null)

        saveCart(items)
        return {items, changed}
    })
}


export const getCartTotal = items => items.reduce((sum, item) => sum + item.price * item.qty, 0)
