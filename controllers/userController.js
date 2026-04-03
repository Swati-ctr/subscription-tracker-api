// ===============================
// User Controller
// ===============================

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// POST /api/users/register
// ===============================

exports.registerUser = async (req, res) => {
    try {
        // check if validation passed from userRoutes.js
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }

        // extract fields from request body
        const { name, email, password } = req.body;

        // check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash the password before saving — never store plain text passwords
        // 10 is the salt rounds — higher = more secure but slower
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user with hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // save user to MongoDB
        await user.save();

        // return success response — never send password back!
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ===============================
// POST /api/users/login
// ===============================

exports.loginUser = async (req, res) => {
    try {
        // check if validation passed from userRoutes.js
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }

        // extract fields from request body
        const { email, password } = req.body;

        // find user by email in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // compare entered password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // generate JWT token — expires in 30 days
        // token contains user id so we can identify user in protected routes
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        // return token and user info — never send password back!
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};