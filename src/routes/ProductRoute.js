const express = require('express');
const { Product } = require('../models/Product');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router()

router.post('/register-product', authMiddleware, async (req, res) => {
    const { name, description, price, discount, stock, image } = req.body;

    try {
        const newproduct = await Product.create({
            name,
            description,
            price,
            discount,
            stock,
            image: req.file ? req.file.filename : null
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