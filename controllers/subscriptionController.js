// ===============================
// Subscription Controller
// ===============================

const Subscription = require("../models/Subscription");

// ===============================
// POST /api/subscriptions
// ===============================

const createSubscription = async (req, res) => {
    try {
        // extract fields from request body
        const { name, plan, price, billingCycle } = req.body;

        // set start date as today
        const startDate = new Date();

        // create a copy of startDate for renewal calculation
        // we use new Date(startDate) to avoid mutating the original date
        const renewalDate = new Date(startDate);

        // calculate renewal date based on billing cycle
        if (billingCycle === "yearly") {
            renewalDate.setFullYear(renewalDate.getFullYear() + 1); // add 1 year
        } else {
            renewalDate.setMonth(renewalDate.getMonth() + 1); // add 1 month
        }

        // create and save subscription to MongoDB
        const subscription = await Subscription.create({
            name,
            plan,
            price,
            billingCycle,
            renewalDate,
            user: req.user.id  // link to logged in user
        });

        res.status(201).json(subscription);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET /api/subscriptions
// ===============================

const getSubscriptions = async (req, res) => {
    try {
        // find all subscriptions belonging to logged in user
        const subscriptions = await Subscription.find({ user: req.user.id });
        res.status(200).json(subscriptions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// PUT /api/subscriptions/:id
// ===============================

const updateSubscription = async (req, res) => {
    try {
        // find subscription by id — only if it belongs to logged in user
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user.id  // ensures user can only update their own
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // extract only the fields user wants to update
        const { name, plan, price, isActive } = req.body;

        // only update fields that were actually sent — leave rest unchanged
        if (name) subscription.name = name;
        if (plan) subscription.plan = plan;
        if (price) subscription.price = price;
        // isActive is boolean so we check undefined not falsy
        if (isActive !== undefined) subscription.isActive = isActive;

        // save updated subscription to MongoDB
        await subscription.save();
        res.status(200).json(subscription);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// DELETE /api/subscriptions/:id
// ===============================

const deleteSubscription = async (req, res) => {
    try {
        // find and delete subscription in one operation
        // only deletes if it belongs to logged in user
        const subscription = await Subscription.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.status(200).json({ message: "Subscription deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET /api/subscriptions/expiring
// ===============================

const getExpiringSubscriptions = async (req, res) => {
    try {
        const today = new Date();
        const next7Days = new Date(); // ✅ fixed — was newDate() missing space
        next7Days.setDate(today.getDate() + 7);

        // find subscriptions whose renewal date falls within next 7 days
        // $gte = greater than or equal to (>=)
        // $lte = less than or equal to (<=)
        const expiring = await Subscription.find({
            user: req.user.id,
            renewalDate: { $gte: today, $lte: next7Days } // ✅ fixed — was next7days lowercase
        });

        res.status(200).json(expiring);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// GET /api/subscriptions/summary
// ===============================

const getSubscriptionSummary = async (req, res) => {
    try {
        // get all subscriptions of logged in user
        const subscriptions = await Subscription.find({ user: req.user.id });

        // calculate total monthly spend
        let totalMonthlySpend = 0;

        subscriptions.forEach(sub => {
            if (sub.billingCycle === "yearly") {
                // convert yearly price to monthly for fair comparison
                totalMonthlySpend += sub.price / 12;
            } else {
                totalMonthlySpend += sub.price;
            }
        });

        res.status(200).json({
            // total number of subscriptions
            subscriptionCount: subscriptions.length,
            // round off decimals for cleaner output
            totalMonthlySpend: Math.round(totalMonthlySpend),
            totalYearlySpend: Math.round(totalMonthlySpend * 12),
            // simplified breakdown of each subscription
            breakdown: subscriptions.map(sub => ({
                name: sub.name,
                price: sub.price,
                billingCycle: sub.billingCycle
            }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===============================
// Exports
// ===============================

module.exports = {
    createSubscription,
    getSubscriptions,
    updateSubscription,
    deleteSubscription,
    getExpiringSubscriptions,
    getSubscriptionSummary
};