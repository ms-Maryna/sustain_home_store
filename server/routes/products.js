const router = require("express").Router();
const createError = require("http-errors");
const productsModel = require("../models/products");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { uploadProductImages } = require("../middleware/middlewareFile");

// KEYS for JWT verification
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, "../keys/private.pem"), "utf8");
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8");


// ===== GET all products =====
router.get("/", (req, res, next) => {
    productsModel.find({})
        .then(data => res.json(data))
        .catch(err => next(err));
});


// ===== GET one product by ID =====
router.get("/:id", (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(data => {
            if(!data) return next(createError(404, "Product not found"));
            res.json(data);
        })
        .catch(err => next(err));
});


// ===== ADD product (ADMIN) =====
router.post("/", uploadProductImages.array("images", 10), (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return next(createError(403, "No token provided"));

    jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) return next(createError(403, "Invalid token"));
        if (decoded.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN))
            return next(createError(403, "Not an admin"));

        // Check uploaded images
        if (!req.files || req.files.length === 0)
            return next(createError(400, "At least 1 image required"));

        // Validate image types
        for (let f of req.files) {
            if (!["image/png", "image/jpg", "image/jpeg"].includes(f.mimetype)) {
                // Delete uploaded files if invalid
                req.files.forEach(file =>
                    fs.unlinkSync(`${process.env.UPLOADED_FILES_FOLDER}/${file.filename}`)
                );
                return next(createError(400, "Invalid image type"));
            }
        }

        // Prepare body for DB
        req.body.images = req.files.map(f => f.filename);
        req.body.price = Number(req.body.price);
        req.body.stock = Number(req.body.stock);
        req.body.powerUsage = Number(req.body.powerUsage);
        req.body.ecoCertified = (req.body.ecoCertified === "true" || req.body.ecoCertified === true);

        productsModel.create(req.body)
            .then(product => res.json(product))
            .catch(err => next(err));
    });
});


// ===== UPDATE product (ADMIN) =====
// Important: Added multer middleware here for handling new images
router.put("/:id", uploadProductImages.array("images", 10), (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return next(createError(403, "No token provided"));

    jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) return next(createError(403, "Invalid token"));
        if (decoded.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN))
            return next(createError(403, "Not an admin"));

        // If new images uploaded, replace the 'images' field
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(f => f.filename);
        }

        // Convert numeric and boolean fields
        req.body.price = Number(req.body.price);
        req.body.stock = Number(req.body.stock);
        req.body.powerUsage = Number(req.body.powerUsage);
        req.body.ecoCertified = (req.body.ecoCertified === "true" || req.body.ecoCertified === true);

 

       productsModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { returnDocument: "after" } 
        )
            .then(data => {
                if (!data) return next(createError(404, "Product not found"));
                res.json(data);
            })
            .catch(err => next(err));
    });
});


// ===== DELETE product (ADMIN) =====
router.delete("/:id", (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return next(createError(403, "No token provided"));

    jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) return next(createError(403, "Invalid token"));
        if (decoded.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN))
            return next(createError(403, "Not an admin"));

        productsModel.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data) return next(createError(404, "Product not found"));
                res.json({ message: "Product deleted" });
            })
            .catch(err => next(err));
    });
});


module.exports = router;