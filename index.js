const express= require("express");
const mongoose=require("mongoose");


const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const subscriptionRoutes = require("./routes/subscriptionRoutes"); // 👈 IMPORTANT
const userRoutes = require("./routes/userRoutes"); // 👈 IMPORTANT


const app=express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);


console.log("THIS INDEX FILE IS RUNNING");

mongoose.connect("mongodb://localhost:27017/subscriptionDB")
.then(()=>console.log("Connected to MongoDB"))
.catch(err=>console.log(err));

app.get("/", (req, res) => {
    res.send("Server is running properly");
});
 




app.listen(3000,()=>{
    console.log("server running on port 3000");
});