const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticateAccessToken } = require("../middlewares/authenticateAccessToken");
const { isAdmin } = require("../middlewares/isAdmin");

// get all users for admin
router.get("/", authenticateAccessToken, isAdmin ,async (req, res) => {
    try{
        const users = await User.find();
        res.json(users); 
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

// get user by id for admin
router.get("/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.body.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
})


// delete user for admin
router.delete("/delete/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try{
        const status = await User.findByIdAndDelete(req.params.id);
        res.json(status ? "Successfully deleted" : "Error");
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});


// edit user 
router.put("/edit/:id", authenticateAccessToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        });

        if(updatedUser){
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;