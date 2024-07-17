const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");
const { isAdmin } = require("../middlewares/isAdmin");

// get user's order
router.get("/", authenticateAccessToken, async (req, res) => {
    try{
        const orders = await Order.find({ owner: req.user }).populate("products");
        res.json(orders); 
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

// get order by id
router.get("/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate("products").populate("owner", "firstname lastname email");
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


// delete an order
router.delete("/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// create a new order
router.post("/create", authenticateAccessToken, async (req, res) => {
    const { products } = req.body;
    const order = new Order({
        products,
        owner: req.user
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// edit an order
router.put("/edit/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { products } = req.body;
        if (products) order.products = products;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;