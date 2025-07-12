const mongoose = require('mongoose')

const RegisterProduct = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true }
})

const Product = mongoose.model('Product', RegisterProduct)
module.export = { Product };