const express = require('express');
require('dotenv').config();
const ProductData = require('../models/ProductData');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/product_images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  },
});

router.post('/product-registration', upload.single('image'), async (req, res) => {
  const { name, price, discount, description } = req.body;

  try {
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/public/product_images/${req.file.filename}`
      : null;

    const newProduct = await ProductData.create({
      name,
      price,
      discount,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      product: newProduct,
      message: 'Product registered successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Product registration failed',
      error: error.message,
    });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});


router.get('/all-products', async (req, res) => {
  try {
    const products = await ProductData.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
})

module.exports = router;









// const express = require('express');
// require('dotenv').config();
// const ProductData = require('../models/ProductData');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'public/product_images');
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif|webp/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) return cb(null, true);
//     cb(new Error('Only image files are allowed!'));
//   }
// });


// router.post('/product-registration', upload.single('image'), async (req, res) => {
//     const { name, price, discount, descriptions } = req.body;

//     try {
//         const newProduct = await ProductData.create({
//             name,
//             price,
//             discount,
//             descriptions,
//             image: req.file ? `http://localhost:4000/public/product_images/${req.file.filename}` : null
//         });
//         res.status(201).json({
//             success: true,
//             Product: newProduct,
//             message: 'Product registred successfully!'
//         });
//     } catch(error) {
//         res.status(500).json({
//             success: false,
//             message: 'Product registration failed',
//             error: error.message
//         })
//     }
// });