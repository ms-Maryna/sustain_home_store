// Loads the products from seed/products.json into MongoDB.
// Run with:  npm run seed
// Add --reset to delete all products first:  npm run seed -- --reset
// Add --admin to create (or reset) the admin account:  npm run seed -- --admin
//   (email and password come from ADMIN_EMAIL and ADMIN_PASSWORD in .env)
//
// To fill the ONLINE database, put MONGODB_URI (Atlas connection string) in .env first.

require("dotenv").config({path: "./config/.env"})

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const productsModel = require("./models/products")
const usersModel = require("./models/users")
const products = require("./seed/products.json")

const run = async () =>
{
    await mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME}`)

    if(process.argv.includes("--admin"))
    {
        const email = process.env.ADMIN_EMAIL || "admin@admin.com"
        const password = process.env.ADMIN_PASSWORD
        if(!password || password.length < 8) throw new Error("Please set ADMIN_PASSWORD (at least 8 characters) in config/.env")

        const hash = await bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10)
        await usersModel.updateOne(
            {email: email},
            {$set: {name: "Administrator", email: email, password: hash, accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN) || 2}},
            {upsert: true}
        )
        console.log(`Admin account ready: ${email}`)
    }

    if(process.argv.includes("--reset"))
    {
        await productsModel.deleteMany({})
        console.log("All products deleted")
    }

    const count = await productsModel.countDocuments()
    if(count > 0)
    {
        console.log(`There are already ${count} products. Use --reset to load them again.`)
    }
    else
    {
        await productsModel.insertMany(products)
        console.log(`${products.length} products added`)
    }

    await mongoose.disconnect()
}

run().catch(err =>
{
    console.error(err)
    process.exit(1)
})
