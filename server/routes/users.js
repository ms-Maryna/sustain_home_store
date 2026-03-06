const router = require("express").Router();
const createError = require("http-errors");
const usersModel = require("../models/users");

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multerMiddleware = require("../middleware/middlewareFile");

// KEYS
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, "../keys/private.pem"), "utf8");
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8");

// ===== RESET USERS  =====
router.post(`/reset_user_collection`, (req, res, next) => {
    usersModel.deleteMany({})
    .then(() => {
        const adminPassword = "123-qwe_QWE";
        bcrypt.hash(adminPassword, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
            if(err) return next(err);

            usersModel.create({
                name: "Administrator",
                email: "admin@admin.com",
                password: hash,
                accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN)
            })
            .then(admin => res.json(admin))
            .catch(err => next(createError(500, "Failed to create Admin user")));
        });
    })
    .catch(err => next(err));
});

// ===== REGISTER =====
router.post(`/register/:name/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
    .then(existingUser => {
        if(existingUser) return next(createError(403, "User already exists"));

        bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
            if(err) return next(err);

            usersModel.create({
                name: req.params.name,
                email: req.params.email,
                password: hash,
                accessLevel: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)
            })
            .then(user => {
                const token = jwt.sign(
                    { email: user.email, accessLevel: user.accessLevel },
                    PRIVATE_KEY,
                    { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY }
                );
                res.json({ name: user.name, accessLevel: user.accessLevel, token });
            })
            .catch(err => next(createError(500, "Failed to create user")));
        });
    })
    .catch(err => next(err));
});

// ===== LOGIN =====
router.post(`/login/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
    .then(user => {
        if(!user) return next(createError(403, "User not found"));

        bcrypt.compare(req.params.password, user.password, (err, result) => {
            if(err) return next(err);

            if(result) {
                const token = jwt.sign(
                    { email: user.email, accessLevel: user.accessLevel },
                    PRIVATE_KEY,
                    { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY }
                );
                res.json({ name: user.name, accessLevel: user.accessLevel, token });
            } else {
                next(createError(403, "Invalid password"));
            }
        });
    })
    .catch(err => next(err));
});

// ===== PROFILE GET =====
router.get("/profile", (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return next(createError(403, "No token provided"));

    jwt.verify(authHeader, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if(err) return next(createError(403, "Invalid token"));

        usersModel.findOne({email: decoded.email}, {password: 0})
        .then(user => {
            if(!user) return next(createError(404, "User not found"));
            res.json(user);
        })
        .catch(err => next(err));
    });
});

// ===== PROFILE UPDATE =====
router.put("/profile", multerMiddleware.uploadProfileImage.single("profileImage"), (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        if(req.file) fs.unlinkSync(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`);
        return next(createError(403, "No token provided"));
    }

    jwt.verify(authHeader, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if(err) {
            if(req.file) fs.unlinkSync(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`);
            return next(createError(403, "Invalid token"));
        }

        const update = {};
        if(req.body.name) update.name = req.body.name;
        if(req.body.address) update.address = req.body.address;
        if(req.body.phone) update.phone = req.body.phone;
        if(req.file) {
            const mimetype = req.file.mimetype;
            if(!["image/png","image/jpg","image/jpeg"].includes(mimetype)) {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`);
                return next(createError(400, "Invalid image type"));
            }
            update.profileImage = req.file.filename;
        }

        usersModel.findOneAndUpdate(
            {email: decoded.email},
            {$set: update},
            {new: true, projection: {password: 0}}
        )
        .then(user => {
            if(!user) return next(createError(404, "User not found"));
            res.json(user);
        })
        .catch(err => next(err));
    });
});

module.exports = router;