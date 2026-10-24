const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === Product Images (multiple) ===
const storageProductImages = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.env.UPLOADED_FILES_FOLDER, "products");
    fs.mkdirSync(dir, { recursive: true }); // creates the folder if it does not exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "-").replace(ext, "");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});
const uploadProductImages = multer({ storage: storageProductImages, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB per image

// === Profile Image (single) ===
const storageProfileImage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.env.UPLOADED_FILES_FOLDER, "profile");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "-").replace(ext, "");
    cb(null, `profile-${Date.now()}-${safeName}${ext}`);
  }
});
const uploadProfileImage = multer({ storage: storageProfileImage, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB

module.exports = { uploadProductImages, uploadProfileImage };