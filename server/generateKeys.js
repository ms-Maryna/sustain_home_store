// server/generateKeys.js

const fs = require("fs");          // Node.js file system module
const path = require("path");      // Node.js path module to handle file paths
const { generateKeyPairSync } = require("crypto"); // Node.js crypto module to generate RSA keys

// Directory where the keys will be stored
const keysDir = path.join(__dirname, "keys");

// Create 'keys' directory if it does not exist
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
  console.log("Folder 'keys' has been created.");
} else {
  console.log("Folder 'keys' already exists.");
}

// Generate a 2048-bit RSA key pair
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,       // key size in bits
  publicKeyEncoding: {
    type: "spki",            // Recommended public key format
    format: "pem",           // Save as PEM file
  },
  privateKeyEncoding: {
    type: "pkcs8",           // Recommended private key format
    format: "pem",           // Save as PEM file
  },
});

// Define paths to save the keys
const privatePath = path.join(keysDir, "private.pem");
const publicPath = path.join(keysDir, "public.pem");

// Save the keys to the file system
fs.writeFileSync(privatePath, privateKey);
fs.writeFileSync(publicPath, publicKey);

console.log("Keys have been generated and saved in the 'keys' folder:");
console.log(`- private.pem → ${privatePath}`);
console.log(`- public.pem → ${publicPath}`);