const express = require('express');
const Product = require('../models/Product');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware');
const multer = require('multer');
const path = require('path');
const { route } = require('./auth');
const router = express.Router()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/product_images');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
});

router.post('/register-product', upload.single('image'), async (req, res) => {
    const { name, description, price, discount, stock } = req.body;

    try {
        const newproduct = await Product.create({
            name,
            description,
            price,
            discount,
            stock,
            image: req.file ? `http://localhost:4000/public/product_images/${req.file.filename}` : null
        });

        res.status(201).json({
            success: true,
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

// router.get('/get-product', async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 3;

//     try {
//         const products = await Product.paginate({}, { page, limit, sort: { createdAt: -1 } });

//         res.status(200).json({
//             success: true,
//             products,
//             });
//         } catch(err) {
//             res.status(500).json({
//                 success: true,
//                 message: 'Failed to fetch product',
//                 Error: err.message
//             });
//         }
// });

// router.get('/get-product', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 3;

//   try {
//     const products = await Product.paginate({}, { page, limit, sort: { createdAt: -1 } });

//     // Format to match Laravel
//     res.status(200).json({
//       success: true,
//       products: {
//         current_page: result.page,
//         data: products.docs,
//         total: result.totalDocs,
//         per_page: result.limit,
//         last_page: result.totalPages,
//         from: (result.page - 1) * result.limit + 1,
//         to: Math.min(result.page * result.limit, result.totalDocs),
//       }
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch products',
//       error: err.message
//     });
//   }
// });


router.get('/get-product', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;

  try {
    const products = await Product.paginate({}, { page, limit, sort: { createdAt: -1 } });

    res.status(200).json({
      success: true,
      products: {
        current_page: products.page,
        data: products.docs,
        total: products.totalDocs,
        per_page: products.limit,
        last_page: products.totalPages,
        from: (products.page - 1) * products.limit + 1,
        to: Math.min(products.page * products.limit, products.totalDocs),
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: err.message
    });
  }
});




module.exports = router;