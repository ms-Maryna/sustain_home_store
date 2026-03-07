// server/app.js

// ===============================
// Load environment variables
// ===============================
require("dotenv").config({ path: "./config/.env" });

// ===============================
// Database connection
// ===============================
require("./config/db");

// ===============================
// Import modules
// ===============================
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// ===============================
// Import routers
// ===============================
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const purchasesRouter = require("./routes/purchases")

// ===============================
// Import error middleware
// ===============================
const errorHandler = require("./middleware/errorMiddleware");

// ===============================
// Initialize Express app
// ===============================
const app = express();

// ===============================
// Middleware
// ===============================

// Parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors({ credentials: true, origin: process.env.LOCAL_HOST }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/uploads", express.static("uploads"))
// ===============================
// Routes
// ===============================
app.get("/", (req, res) => res.send("Server works"));

// Use routers for API endpoints
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/purchases", purchasesRouter);

// Paypal
const paypalRoutes = require("./routes/paypalRoutes")

app.use("/api/paypal", paypalRoutes)

// ===============================
// Catch 404 errors
// ===============================
app.use((req, res, next) => {
  next(createError(404, "Resource not found"));
});

// ===============================
// Error handling middleware
// ===============================
// This will handle all errors thrown in routes or other middleware
app.use(errorHandler);

// ===============================
// Start server
// ===============================
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Connected to port ${process.env.SERVER_PORT}`);
});