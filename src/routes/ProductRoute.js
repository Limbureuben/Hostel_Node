const express = require('express');
const { Product } = require('../models/Product');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router()

router.post('/register-product', authMiddleware, async (req, res) => {
    const { product_name, product_descriptions, product_category, discount_price, product_price, product_image } = req.body;

    try {
        const newproduct = await Product.create({
            product_name,
            product_descriptions,
            product_category,
            discount_price,
            product_price,
            product_image: req.file ? req.file.filename : null
        });

        res.status(201).json({
            Product: newproduct,
            message: 'Product uploaded successfully'
        });
    } catch(error) {
        res.status(500).json({
            message: 'Pruduct upload filed',
            error: error.message
        });
    }
});

module.exports = router;