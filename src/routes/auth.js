const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }

  try {
    const userExist = await User.findOne({ $or: [{ username }, { email }] });

    if (userExist) {
      return res.status(400).json({  // Make sure to RETURN
        message: "User already exists"
      });
    }
    
    const user = await User.create({ 
      username, 
      email, 
      password, 
      role: role || 'user'
    });
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
    
  } catch(error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({  // Make sure to RETURN
        message: 'Invalid username or password' 
      });
    }
    
    // Single response
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
    
  } catch(error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


router.get('/users', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;

  try {
    const result = await User.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        select: '-password'  // Exclude password
      }
    );

    res.status(200).json({
      success: true,
      Users: {
        data: result.docs
      },
      pagination: {
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
});


router.delete('/users/:id', authMiddleware, async(req, res)=> {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: err.message
    });
  }
})


module.exports = router;