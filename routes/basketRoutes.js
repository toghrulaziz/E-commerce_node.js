const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");


// get user's basket
router.get("/", authenticateAccessToken, async (req, res) => {
    try{
        const basket = await User.findById(req.user).populate("basket");
        res.json(basket); 
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


// add to basket 
router.post("/add/:productId", authenticateAccessToken, async (req, res) => {
    try{
        await User.updateOne(
            { _id: req.user },
            { $addToSet: { basket: req.params.productId }}
        );
        res.status(201).json("Product added to basket");
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


// remove from basket
router.post("/remove/:productId", authenticateAccessToken, async (req, res) => {
    try{
        await User.updateOne(
            { _id: req.user},
            { $pull: { basket: req.params.productId }}
        );
        res.status(201).json("Product removed from basket");
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;