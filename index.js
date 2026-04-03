// ===============================
// Entry point of the application
// ===============================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// route imports
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

// middleware imports
const errorHandler = require("./middleware/errorHandler");

// initialise express app
const app = express();

// ===============================
// Middleware
// ===============================

// parse incoming JSON requests
app.use(express.json());

// ===============================
// Routes
// ===============================

// default route — check if server is running
app.get("/", (req, res) => {
    res.send("Server is running properly");
});

// user routes — register and login
app.use("/api/users", userRoutes);

// subscription routes — CRUD operations
app.use("/api/subscriptions", subscriptionRoutes);

// global error handler — must be at the bottom
app.use(errorHandler);

// ===============================
// Database Connection
// ===============================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

// ===============================
// Start Server
// ===============================

app.listen(3000, () => {
    console.log("Server running on port 3000");
});