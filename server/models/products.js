const mongoose = require("mongoose")

let productsSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    energyRating: {type: String, required: true},
    brand: {type: String, required: true},
    condition: {type: String, required: true},
    powerUsage: {type: Number, required: true},
    ecoCertified: {type: Boolean, required: true},
    images: {type: [String], required: true},
    description: {type: String, required: true}
},
{
    collection: "products"
})

module.exports = mongoose.model("products", productsSchema)

