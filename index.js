require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(DATABASE_URL)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

    
app.use("/order", orderRoutes);
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);



port = 3000;
app.listen(3000, () => {
    console.log(`Server running on port ${port}`);
});