const mongoose = require("mongoose");


const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true  
        },

        plan: {
            type: String,
            required: true,
            enum: ["basic", "standard", "premium"]
        },

        price: {
            type: Number,
            required: true
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        isActive: {
            type: Boolean,
            default: true
        },

        billingCycle: {
            type: String,
            enum: ["monthly", "yearly"],
            default: "monthly"
        },

        renewalDate: {
            type: Date
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;