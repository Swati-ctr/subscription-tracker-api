const Subscription = require("../models/Subscription");
const createSubscription = async (req, res) => {
    try {
       
        const { name, plan, price, billingCycle } = req.body;

       
        const startDate = new Date();

        
        const renewalDate = new Date(startDate);

        if (billingCycle === "yearly") {
            renewalDate.setFullYear(renewalDate.getFullYear() + 1); 
        } else {
            renewalDate.setMonth(renewalDate.getMonth() + 1); 
        }

        const subscription = await Subscription.create({
            name,
            plan:plan?.toLowerCase(),
            price,
            billingCycle,
            renewalDate,
            user: req.user.id 
        });

        res.status(201).json(subscription);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id });
        res.status(200).json(subscriptions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user.id 
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        const { name, plan, price, isActive } = req.body;

        if (name) subscription.name = name;
        if (plan) subscription.plan = plan;
        if (price) subscription.price = price;
        if (isActive !== undefined) subscription.isActive = isActive;

        await subscription.save();
        res.status(200).json(subscription);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteSubscription = async (req, res) => {
    try {
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



const getExpiringSubscriptions = async (req, res) => {
    try {
        const today = new Date();
        const next7Days = new Date(); 
        next7Days.setDate(today.getDate() + 7);

        
        const expiring = await Subscription.find({
            user: req.user.id,
            renewalDate: { $gte: today, $lte: next7Days } 
        });

        res.status(200).json(expiring);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getSubscriptionSummary = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id });

        let totalMonthlySpend = 0;

        subscriptions.forEach(sub => {
            if (sub.billingCycle === "yearly") {
                totalMonthlySpend += sub.price / 12;
            } else {
                totalMonthlySpend += sub.price;
            }
        });

        res.status(200).json({
            subscriptionCount: subscriptions.length,
            totalMonthlySpend: Math.round(totalMonthlySpend),
            totalYearlySpend: Math.round(totalMonthlySpend * 12),
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



module.exports = {
    createSubscription,
    getSubscriptions,
    updateSubscription,
    deleteSubscription,
    getExpiringSubscriptions,
    getSubscriptionSummary
};