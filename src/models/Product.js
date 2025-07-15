const mongoose = require('mongoose')

const RegisterProduct = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, max: 100, default: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, default: null }
})

const Product = mongoose.model('Product', RegisterProduct)
module.export = { Product };