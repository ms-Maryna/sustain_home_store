const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const {PUBLIC_KEY} = require("../config/keys")


// The token must be valid. Saves the decoded token in req.user (email + accessLevel)
function verifyToken(req, res, next)
{
    const token = req.headers.authorization
    if(!token || token === "null") return next(createError(403, "No token provided"))

    jwt.verify(token, PUBLIC_KEY, {algorithms: ["RS256"]}, (err, decoded) =>
    {
        if(err) return next(createError(403, "Invalid token"))
        req.user = decoded
        next()
    })
}


// The token is optional (guest checkout).
// If a valid token is sent, req.user is filled in. Otherwise req.user is null.
function optionalToken(req, res, next)
{
    const token = req.headers.authorization
    req.user = null
    if(!token || token === "null") return next()

    // a token was sent but it is wrong or expired -> tell the client to log in again
    // (otherwise the order would be saved as a guest order by mistake)
    jwt.verify(token, PUBLIC_KEY, {algorithms: ["RS256"]}, (err, decoded) =>
    {
        if(err) return next(createError(403, "Invalid token"))
        req.user = decoded
        next()
    })
}


// Use after verifyToken
function requireAdmin(req, res, next)
{
    if(!req.user) return next(createError(403, "User not authenticated"))
    if(req.user.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN))
    {
        return next(createError(403, "Admin access required"))
    }
    next()
}


// Use after verifyToken
function requireUser(req, res, next)
{
    if(!req.user) return next(createError(403, "User not authenticated"))
    next()
}

module.exports = {verifyToken, optionalToken, requireAdmin, requireUser}
