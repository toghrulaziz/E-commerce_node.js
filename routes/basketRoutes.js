const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");


// get user's basket
router.get("/", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user; 

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findById(userId).populate("basket"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.basket);
    } catch (err) {
        console.error("Error fetching basket:", err);
        res.status(500).json({ message: err.message });
    }
});


// Add to basket
router.post("/add/:productId", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const { productId } = req.params;
        const result = await User.updateOne(
            { _id: userId },
            { $addToSet: { basket: productId } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product or user not found" });
        }

        res.status(200).json("Product added to basket");
    } catch (err) {
        console.error("Error adding product to basket:", err);
        res.status(500).json({ message: err.message });
    }
});

// Remove from basket
router.post("/remove/:productId", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const { productId } = req.params;
        const result = await User.updateOne(
            { _id: userId },
            { $pull: { basket: productId } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product or user not found" });
        }

        res.status(200).json("Product removed from basket");
    } catch (err) {
        console.error("Error removing product from basket:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;