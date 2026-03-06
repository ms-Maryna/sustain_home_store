const multer = require("multer")

// Product images (many)
const uploadProductImages = multer({
    dest: process.env.UPLOADED_FILES_FOLDER
})

// Profile image (single)
const uploadProfileImage = multer({
    dest: process.env.UPLOADED_FILES_FOLDER
})

module.exports = {uploadProductImages, uploadProfileImage}

