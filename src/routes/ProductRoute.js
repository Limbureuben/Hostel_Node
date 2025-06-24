const express = require('express');
const { Product } = require('../models/Product');
require('dotenv').config();

const router = express.Router()

router.post('/register-product', async (req, res) => {
    const { product_name, product_descriptions, product_category, discount_price, product_price, product_image } = req.body;

    try {
        const newproduct = await Product.create({
            product_name,
            product_descriptions,
            product_category,
            discount_price,
            product_price,
            product_image
        });

        res.status(201).json({
            Product: {
                id: newproduct._id,
                product_name,
                product_descriptions,
                product_category,
                discount_price,
                product_price,
                product_image
            }
        });
    } catch(error) {
        res.status(500).json({
            message: 'Pruduct upload filed',
            error: error.message
        });
    }
});