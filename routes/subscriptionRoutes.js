// ===============================
// Subscription Routes
// ===============================

const express = require("express");
const router = express.Router();

// middleware import
const protect = require("../middleware/authMiddleware");

// controller imports
const {
    createSubscription,
    getSubscriptions,
    updateSubscription,
    deleteSubscription,
    getExpiringSubscriptions,
    getSubscriptionSummary
} = require("../controllers/subscriptionController");

// ===============================
// Routes
// ===============================

// GET /api/subscriptions/expiring — get subscriptions expiring in 7 days
// ⚠️ specific routes must come before /:id routes
router.get("/expiring", protect, getExpiringSubscriptions);

// GET /api/subscriptions/summary — get total spend summary
router.get("/summary", protect, getSubscriptionSummary);

// GET /api/subscriptions — get all subscriptions of logged in user
router.get("/", protect, getSubscriptions);

// POST /api/subscriptions — create a new subscription
router.post("/", protect, createSubscription);

// PUT /api/subscriptions/:id — update a specific subscription
router.put("/:id", protect, updateSubscription);

// DELETE /api/subscriptions/:id — delete a specific subscription
router.delete("/:id", protect, deleteSubscription);

module.exports = router;