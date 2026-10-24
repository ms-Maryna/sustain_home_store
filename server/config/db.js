const mongoose = require("mongoose")

// Online (demo): MONGODB_URI is the MongoDB Atlas connection string.
// On your computer: the local database is used.
const uri = process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME}`

mongoose.connect(uri)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => console.log("connected to MongoDB"))

module.exports = uri
