# Sustain Home Store

An online shop for eco-friendly home appliances for the Irish and EU market.
Built for the Full Stack Development module at Dundalk Institute of Technology (DkIT).

**Tech:** React.js · Node.js / Express · MongoDB (Mongoose) · JWT (RS256) · PayPal Sandbox

## Features

**Customers**
- Browse, search, filter by category and sort by price or name
- Shopping cart with a live item counter and an "Added to cart" message
- Checkout as a guest, or log in to have your details filled in automatically
- Pay with PayPal (sandbox)
- Purchase history with order status
- Return products within 30 days, and follow the status of each return request
- Profile page with photo upload

**Administrator**
- Add, edit and delete products (with multiple images)
- View customers and their orders
- View all orders and approve or reject return requests (approved returns go back into stock)

## Security

- **Prices are always calculated on the server.** The client only sends product IDs and quantities.
  The server reads the real prices from the database, checks the stock, and saves the total.
  PayPal is charged the total saved in the database, and the server checks the captured amount.
  Changing a price in the browser (DevTools / localStorage) has no effect.
- Passwords are hashed with bcrypt, and login details are sent in the request body (not in the URL).
- Admin and user routes are protected with JWT tokens signed with an RSA private key.
- Users can only see and return their own orders.

## How to run

You need Node.js and MongoDB running on your computer (`localhost:27017`). MongoDB Compass can be used to view the data.

**1. Server**
```
cd server
npm install
cp config/.env.example config/.env     # then add your PayPal sandbox keys
npm run keys                           # creates the JWT keys in server/keys
npm run seed                           # adds the products to the database
npm run dev                            # http://localhost:4000
```
To create the admin account, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `config/.env` and run
`npm run seed -- --admin`.

**2. Client**
```
cd client
npm install
npm start                              # http://localhost:3000
```

## API overview

| Method | Route | Access |
|---|---|---|
| GET | `/api/products`, `/api/products/:id` | Everyone |
| POST / PUT / DELETE | `/api/products/:id` | Admin |
| POST | `/api/users/register`, `/api/users/login` | Everyone |
| GET / PUT | `/api/users/profile` | User |
| GET | `/api/users`, `/api/users/:id` | Admin |
| POST | `/api/purchases` | Everyone (guest or user) |
| GET | `/api/purchases/my` | User |
| GET | `/api/purchases` | Admin |
| POST | `/api/purchases/:id/returns` | User (own orders) |
| PUT | `/api/purchases/:id/returns/:returnId` | Admin |
| POST | `/api/paypal/create-order`, `/api/paypal/capture-order/:orderID` | Everyone |

## Author

Maryna Hordiienko – [GitHub](https://github.com/ms-Maryna) · [LinkedIn](https://www.linkedin.com/in/maryna-hordiienko-32b79a172)
