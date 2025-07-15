const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

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
        email: user.email
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

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error
    });
  }
})

module.exports = router;