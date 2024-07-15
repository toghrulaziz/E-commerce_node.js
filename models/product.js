const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, maxlength: [200, "Description cannot be more than 200 characters"] },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ["Tech", "Clothing", "Cars"] },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true},
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;