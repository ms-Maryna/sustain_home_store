// server.js

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

// ===============================
// Import routers
// ===============================
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const purchasesRouter = require("./routes/purchases");
const paypalRoutes = require("./routes/paypalRoutes");

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

// Parse JSON bodies (max 1MB)
app.use(express.json({ limit: "1mb" }));

// Enable CORS
// CLIENT_URL = address of the React site online (demo), LOCAL_HOST = http://localhost:3000
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || process.env.LOCAL_HOST }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// Routes
// ===============================
app.get("/", (req, res) => res.send("Server works"));

// Use routers for API endpoints
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/paypal", paypalRoutes);

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
// hosting websites (for example Render) give the port in PORT
const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});