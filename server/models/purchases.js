const mongoose = require("mongoose")

// One product line inside an order.
// Name and price are copied from the database when the order is created,
// so the order keeps the real price even if the product changes later.
const purchaseItemSchema = new mongoose.Schema(
{
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "products", required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    qty: {type: Number, required: true, min: 1},
    image: {type: String, default: ""}
},
{_id: false}
)

// One return request made by the customer
const returnRequestSchema = new mongoose.Schema(
{
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "products", required: true},
    name: {type: String, required: true},
    qty: {type: Number, required: true, min: 1},
    reason: {type: String, required: true, minlength: 5, maxlength: 500},
    status: {type: String, enum: ["Requested", "Approved", "Rejected"], default: "Requested"},
    date: {type: Date, default: Date.now}
}
)

const purchasesSchema = new mongoose.Schema(
{
    // email of the logged in user, or "" for a guest order
    userEmail: {type: String, default: ""},

    customer:
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true}
    },

    items: {type: [purchaseItemSchema], required: true},

    // calculated on the server, never taken from the client
    total: {type: Number, required: true, min: 0},

    status: {type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending"},
    paypalOrderId: {type: String, default: ""},
    paidAt: {type: Date},

    returns: {type: [returnRequestSchema], default: []},

    date: {type: Date, default: Date.now}
},
{collection: "purchases"}
)

module.exports = mongoose.model("purchases", purchasesSchema)
