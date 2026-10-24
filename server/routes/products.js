const router = require("express").Router()
const createError = require("http-errors")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

const productsModel = require("../models/products")
const {uploadProductImages} = require("../middleware/middlewareFile")
const {verifyToken, requireAdmin} = require("../middleware/authMiddleware")

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"]


// ===== Helpers =====

// delete uploaded files (used when something is wrong with the request)
const deleteUploadedFiles = files =>
{
    (files || []).forEach(file =>
    {
        fs.unlink(path.join(process.env.UPLOADED_FILES_FOLDER, "products", file.filename), () => {})
    })
}

// form-data sends everything as text, so convert numbers and booleans
const convertFormFields = body =>
{
    if(body.price !== undefined) body.price = Number(body.price)
    if(body.stock !== undefined) body.stock = Number(body.stock)
    if(body.powerUsage !== undefined) body.powerUsage = Number(body.powerUsage)
    if(body.ecoCertified !== undefined) body.ecoCertified = (body.ecoCertified === "true" || body.ecoCertified === true)
    return body
}

// multer saves the files first, then the token is checked.
// If the user is not an admin, the uploaded files are deleted again.
const checkAdminAndCleanUp = (req, res, next) =>
{
    verifyToken(req, res, err =>
    {
        if(err)
        {
            deleteUploadedFiles(req.files)
            return next(err)
        }
        requireAdmin(req, res, err2 =>
        {
            if(err2) deleteUploadedFiles(req.files)
            next(err2)
        })
    })
}

const hasInvalidImage = files => (files || []).some(f => !ALLOWED_IMAGE_TYPES.includes(f.mimetype))


// ===== GET all products =====
router.get("/", (req, res, next) =>
{
    productsModel.find({})
    .then(data => res.json(data))
    .catch(err => next(err))
})


// ===== GET one product by ID =====
router.get("/:id", (req, res, next) =>
{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(createError(404, "Product not found"))

    productsModel.findById(req.params.id)
    .then(data =>
    {
        if(!data) return next(createError(404, "Product not found"))
        res.json(data)
    })
    .catch(err => next(err))
})


// ===== ADD product (ADMIN) =====
router.post("/", uploadProductImages.array("images", 10), checkAdminAndCleanUp, (req, res, next) =>
{
    if(!req.files || req.files.length === 0) return next(createError(400, "At least 1 image required"))

    if(hasInvalidImage(req.files))
    {
        deleteUploadedFiles(req.files)
        return next(createError(400, "Invalid image type. Use PNG or JPG"))
    }

    const product = convertFormFields(req.body)
    product.images = req.files.map(f => f.filename)

    productsModel.create(product)
    .then(data => res.json(data))
    .catch(err =>
    {
        deleteUploadedFiles(req.files)
        next(createError(400, err.message))
    })
})


// ===== UPDATE product (ADMIN) =====
router.put("/:id", uploadProductImages.array("images", 10), checkAdminAndCleanUp, (req, res, next) =>
{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
    {
        deleteUploadedFiles(req.files)
        return next(createError(404, "Product not found"))
    }

    if(hasInvalidImage(req.files))
    {
        deleteUploadedFiles(req.files)
        return next(createError(400, "Invalid image type. Use PNG or JPG"))
    }

    const update = convertFormFields(req.body)
    delete update._id

    // if new images were uploaded, they replace the old ones
    if(req.files && req.files.length > 0)
    {
        update.images = req.files.map(f => f.filename)
    }
    else
    {
        delete update.images
    }

    productsModel.findByIdAndUpdate(req.params.id, {$set: update}, {returnDocument: "after", runValidators: true})
    .then(data =>
    {
        if(!data) return next(createError(404, "Product not found"))
        res.json(data)
    })
    .catch(err =>
    {
        deleteUploadedFiles(req.files)
        next(createError(400, err.message))
    })
})


// ===== DELETE product (ADMIN) =====
router.delete("/:id", verifyToken, requireAdmin, (req, res, next) =>
{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return next(createError(404, "Product not found"))

    productsModel.findByIdAndDelete(req.params.id)
    .then(data =>
    {
        if(!data) return next(createError(404, "Product not found"))
        res.json({message: "Product deleted"})
    })
    .catch(err => next(err))
})


module.exports = router
