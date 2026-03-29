// ===============================
// Subscription Model
// ===============================

const mongoose = require("mongoose");

// define subscription schema
const subscriptionSchema = new mongoose.Schema(
    {
        // name of the subscription service (e.g. Netflix, Spotify)
        name: {
            type: String,
            required: true,
            trim: true  // removes extra spaces
        },

        // plan type — only these 3 values are allowed
        plan: {
            type: String,
            required: true,
            enum: ["basic", "standard", "premium"]
        },

        // price of the subscription
        price: {
            type: Number,
            required: true
        },

        // date the subscription started — defaults to today
        startDate: {
            type: Date,
            default: Date.now
        },

        // whether the subscription is currently active
        isActive: {
            type: Boolean,
            default: true
        },

        // billing cycle — monthly or yearly, defaults to monthly
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly"],
            default: "monthly"
        },

        // auto calculated renewal date based on billing cycle
        renewalDate: {
            type: Date
        },

        // reference to the user who owns this subscription
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // links to the User model
            required: true
        }
    },
    {
        // automatically adds createdAt and updatedAt fields
        timestamps: true
    }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;