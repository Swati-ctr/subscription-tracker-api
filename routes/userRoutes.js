// ===============================
// User Routes
// ===============================

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/userController");

// ===============================
// Validation Rules
// ===============================

// validation for register route
const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

// validation for login route
const loginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required")
];

// ===============================
// Routes
// ===============================

// POST /api/users/register — register a new user
router.post("/register", registerValidation, registerUser);

// POST /api/users/login — login and get token
router.post("/login", loginValidation, loginUser);

module.exports = router;