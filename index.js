require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Subscription Tracker API is Live!",
        version: "1.0.0",
        endpoints: {
            users: "/api/users",
            subscriptions: "/api/subscriptions"
        }
    });
});

app.use("/api/users", userRoutes);

app.use("/api/subscriptions", subscriptionRoutes);

app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});