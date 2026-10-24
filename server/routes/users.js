const router = require("express").Router()
const createError = require("http-errors")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const usersModel = require("../models/users")
const purchasesModel = require("../models/purchases")
const multerMiddleware = require("../middleware/middlewareFile")
const {verifyToken, requireAdmin} = require("../middleware/authMiddleware")

// ===== JWT KEY (used to sign tokens) =====
const {PRIVATE_KEY} = require("../config/keys")

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


// ===== Helpers =====
const createToken = user => jwt.sign(
    {email: user.email, accessLevel: user.accessLevel},
    PRIVATE_KEY,
    {algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY}
)

// find an email without caring about upper/lower case
const emailQuery = email => ({email: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")})

const deleteProfileUpload = file =>
{
    if(file) fs.unlink(path.join(process.env.UPLOADED_FILES_FOLDER, "profile", file.filename), () => {})
}


// ===== RESET USERS (development only) =====
// Deletes all users and creates the admin account. Disabled in production.
router.post("/reset_user_collection", (req, res, next) =>
{
    if(process.env.NODE_ENV !== "development") return next(createError(404, "Resource not found"))

    usersModel.deleteMany({})
    .then(() => bcrypt.hash("123-qwe_QWE", parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS)))
    .then(hash => usersModel.create(
    {
        name: "Administrator",
        email: "admin@admin.com",
        password: hash,
        accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN)
    }))
    .then(admin => res.json({name: admin.name, email: admin.email}))
    .catch(() => next(createError(500, "Failed to create Admin user")))
})


// ===== REGISTER =====
// body: {name, email, password}
// (sent in the body, not in the URL, so the password does not appear in server logs or browser history)
router.post("/register", async (req, res, next) =>
{
    try
    {
        const {name, email, password} = req.body

        if(typeof name !== "string" || name.trim().length < 2) return next(createError(400, "Name must be at least 2 characters"))
        if(typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) return next(createError(400, "Email is not valid"))
        if(typeof password !== "string" || password.length < 8) return next(createError(400, "Password must be at least 8 characters"))

        const existingUser = await usersModel.findOne(emailQuery(email))
        if(existingUser) return next(createError(409, "A user with this email already exists"))

        const hash = await bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS))

        const user = await usersModel.create(
        {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hash,
            accessLevel: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)
        })

        res.json({name: user.name, accessLevel: user.accessLevel, token: createToken(user)})
    }
    catch(err)
    {
        next(err)
    }
})


// ===== LOGIN =====
// body: {email, password}
router.post("/login", async (req, res, next) =>
{
    try
    {
        const {email, password} = req.body
        if(typeof email !== "string" || typeof password !== "string") return next(createError(400, "Please enter email and password"))

        const user = await usersModel.findOne(emailQuery(email))
        const passwordOk = user ? await bcrypt.compare(password, user.password) : false

        // the same message for both cases, so nobody can check which emails are registered
        if(!passwordOk) return next(createError(403, "Email or password is incorrect"))

        res.json({name: user.name, accessLevel: user.accessLevel, token: createToken(user)})
    }
    catch(err)
    {
        next(err)
    }
})


// ===== GET PROFILE =====
router.get("/profile", verifyToken, (req, res, next) =>
{
    usersModel.findOne({email: req.user.email}, {password: 0})
    .then(user =>
    {
        if(!user) return next(createError(404, "User not found"))
        res.json(user)
    })
    .catch(err => next(err))
})


// ===== UPDATE PROFILE =====
// multer runs first (it reads the form-data), then the token is checked.
// If the token is wrong, the uploaded file is deleted.
const checkTokenAndCleanUp = (req, res, next) =>
{
    verifyToken(req, res, err =>
    {
        if(err) deleteProfileUpload(req.file)
        next(err)
    })
}

router.put("/profile", multerMiddleware.uploadProfileImage.single("profileImage"), checkTokenAndCleanUp, (req, res, next) =>
{
    const update = {}

    if(req.body.name !== undefined)
    {
        if(req.body.name.trim().length < 2)
        {
            deleteProfileUpload(req.file)
            return next(createError(400, "Name must be at least 2 characters"))
        }
        update.name = req.body.name.trim()
    }

    // phone and address can also be cleared (empty string)
    if(req.body.phone !== undefined) update.phone = req.body.phone.trim()
    if(req.body.address !== undefined) update.address = req.body.address.trim()

    if(req.file)
    {
        if(!["image/png", "image/jpg", "image/jpeg"].includes(req.file.mimetype))
        {
            deleteProfileUpload(req.file)
            return next(createError(400, "Invalid image type. Use PNG or JPG"))
        }
        update.profileImage = `profile/${req.file.filename}`
    }

    usersModel.findOneAndUpdate(
        {email: req.user.email},
        {$set: update},
        {returnDocument: "after", runValidators: true}
    )
    .then(user =>
    {
        if(!user) return next(createError(404, "User not found"))

        // never send the password hash back to the client
        const result = user.toObject()
        delete result.password
        res.json(result)
    })
    .catch(err =>
    {
        deleteProfileUpload(req.file)
        next(err)
    })
})


// ===== GET ALL USERS (ADMIN) =====
router.get("/", verifyToken, requireAdmin, (req, res, next) =>
{
    usersModel.find({}, {password: 0})
    .then(users => res.json(users))
    .catch(err => next(err))
})


// ===== GET USER BY ID + their purchases (ADMIN) =====
router.get("/:id", verifyToken, requireAdmin, async (req, res, next) =>
{
    try
    {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(createError(404, "User not found"))

        const user = await usersModel.findById(req.params.id, {password: 0}).lean()
        if(!user) return next(createError(404, "User not found"))

        user.purchases = await purchasesModel.find({userEmail: user.email}).sort({date: -1})
        res.json(user)
    }
    catch(err)
    {
        next(err)
    }
})


module.exports = router
