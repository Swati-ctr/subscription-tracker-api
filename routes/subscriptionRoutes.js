const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createSubscription,
    getSubscriptions,
    updateSubscription,
    deleteSubscription,
    getExpiringSubscriptions,
    getSubscriptionSummary
} = require("../controllers/subscriptionController");

router.get("/expiring", protect, getExpiringSubscriptions);

router.get("/summary", protect, getSubscriptionSummary);

router.get("/", protect, getSubscriptions);

router.post("/", protect, createSubscription);

router.put("/:id", protect, updateSubscription);

router.delete("/:id", protect, deleteSubscription);

module.exports = router;