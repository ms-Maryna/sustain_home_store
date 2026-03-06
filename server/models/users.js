const mongoose = require(`mongoose`)

let usersSchema = new mongoose.Schema(
   {
        name: {type: String, required:true},
        email: {type: String, required:true},
        password: {type: String,required:true},
        address: {type: String, default: ""},
        phone: {type: String, default: ""},
        profileImage: {type: String, default: ""},
        accessLevel: {type: Number, default: 1}
   },
   {
       collection: `users`
   })

module.exports = mongoose.model(`users`, usersSchema)

