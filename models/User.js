// ===============================
// User Model
// ===============================

const mongoose = require("mongoose");

// define user schema
const userSchema = new mongoose.Schema(
    {
        // full name of the user
        name: {
            type: String,
            required: true
        },

        // email must be unique and is automatically lowercased
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        // password is stored as a hashed string using bcrypt
        password: {
            type: String,
            required: true
        }
    },
    {
        // automatically adds createdAt and updatedAt fields
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);