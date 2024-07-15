const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");
const { isAdmin } = require("../middlewares/isAdmin");


// get "/"
router.get("/", async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products); 
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

// get "/:id"
router.get("/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


// put /edit/:id
router.put("/edit/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl
        });

        if(updatedProduct){
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
})

// delete /delete/:id
router.delete("/delete/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try{
        const status = await Product.findByIdAndDelete(req.params.id);
        res.json(status ? "Successfully deleted" : "Error");
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});


// create 
router.post("/create", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;