const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        { type: mongoose.Schema.ObjectId, ref: "Product", required: true},
    ],
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
