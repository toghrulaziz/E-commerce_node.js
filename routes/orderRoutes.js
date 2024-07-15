const express = require("express");
const router = express.Router();
const Order = require("../models/orderItem");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");

// get all
router.get("/", authenticateAccessToken, async (req, res) => {
    try{
        const orders = await Order.find();
        res.json(orders); 
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

// get /:id
router.get("/:id", authenticateAccessToken, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

// delete
router.delete("/delete/:id", authenticateAccessToken, async (req, res) => {
    try{
        const status = await Order.findByIdAndDelete(req.params.id);
        res.json(status ? "Successfully deleted" : "Error");
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});


// create
router.post("/create", authenticateAccessToken, async (req, res) => {
    try {
        const { product, quantity, price } = req.body;
        const newOrder = new Order({
            product,
            quantity,
            price,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// edit
router.put("/edit/:id", authenticateAccessToken, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            product: req.body.product,
            quantity: req.body.quantity,
            price: req.body.price,
        });

        if(updatedOrder){
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
})


module.exports = router;