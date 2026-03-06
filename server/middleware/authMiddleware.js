const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");


const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8");


function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(createError(403, "No token provided"));

    jwt.verify(authHeader, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) return next(createError(403, "Invalid token"));
        req.user = decoded; // email + accessLevel
        next();
    });
}

// Middleware 
function requireAdmin(req, res, next) {
    if (!req.user) return next(createError(403, "User not authenticated"));
    if (req.user.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN)) {
        return next(createError(403, "Admin access required"));
    }
    next();
}


function requireUser(req, res, next) {
    if (!req.user) return next(createError(403, "User not authenticated"));
    next();
}

module.exports = { verifyToken, requireAdmin, requireUser };