require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const basketRoutes = require("./routes/basketRoutes");
const DATABASE_URL = process.env.DATABASE_URL;
const cluster = require("cluster");
const os = require("os");

const app = express();
app.use(express.json());
app.use(cors());

const cpuNum = os.cpus().length;

if(cluster.isMaster){
    for(let i = 0; i < cpuNum; i++){
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker with pid ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    app.listen(4000, () => {
        console.log(`Server running on ${process.pid} @ 4000`);
    });
}


mongoose
    .connect(DATABASE_URL)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

    
app.use("/order", orderRoutes);
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/basket", basketRoutes);


// port = 4000;
// app.listen(4000, () => {
//     console.log(`Server running on port ${port}`);
// });