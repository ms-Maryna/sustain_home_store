function errorHandler(err, req, res, next)
{
    let status = err.status || 500
    let message = err.message || "Internal Server Error"

    // wrong data sent to the database (for example a missing field)
    if(err.name === "ValidationError" || err.name === "CastError")
    {
        status = 400
    }

    // uploaded file is too big
    if(err.code === "LIMIT_FILE_SIZE")
    {
        status = 400
        message = "Image is too big (max 5MB)"
    }

    if(status >= 500)
    {
        console.error(err)
        // do not show internal error details to the user
        message = "Something went wrong on the server"
    }

    res.status(status).json({error: true, message})
}

module.exports = errorHandler
