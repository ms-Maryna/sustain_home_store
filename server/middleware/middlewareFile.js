const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === Product Images (multiple) ===
const storageProductImages = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.env.UPLOADED_FILES_FOLDER, "products");
    fs.mkdirSync(dir, { recursive: true }); // создаёт папку, если её нет
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "-").replace(ext, "");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});
const uploadProductImages = multer({ storage: storageProductImages });

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
const uploadProfileImage = multer({ storage: storageProfileImage });

module.exports = { uploadProductImages, uploadProfileImage };