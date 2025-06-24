const mongoose = require('mongoose')

const RegisterProduct = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_descriptions: { type: String, required: true },
    product_category: { type: String, required: true },
    discount_price: { type: Number, required: true },
    product_price: { type: Number, required: true },
    product_image: { type: String, required: true }
})

const Product = mongoose.model('Product', RegisterProduct)
module.export = { Product };