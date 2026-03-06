const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema(
{
    name: {type: String, required: true, minlength: 2},
    category: {type: String, required: true},
    price: {type: Number, required: true, min: 1, max: 20000},
    stock: {type: Number, required: true, min: 0, max: 10000},
    energyRating: {type: String, required: true, enum: ["A","B","C","D","E","F","G"]},
    brand: {type: String, required: true},
    condition: {type: String, required: true, enum: ["new","used","refurbished"]},
    powerUsage: {type: Number, required: true, min: 0, max: 5000},
    ecoCertified: {type: Boolean, required: true},
    images: {type: [String], required: true},
    description: {type: String, required: true, minlength: 10}
},
{collection: "products"}
)

module.exports = mongoose.model("products", productsSchema)

