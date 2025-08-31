const mongoose = require('mongoose');

const ProductDataSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, max: 100, default: 0 },
    description: { type: String, required: true, maxlength: 255 },
    image: { type: String, default: null }
}, { timestamps: true });


module.exports = mongoose.model('ProductData', ProductDataSchema);