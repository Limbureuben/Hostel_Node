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

router.post('/register', async (req, res)=> {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);

    const { username, email, password, confirmPassword, role } = req.body;

    if (password != confirmPassword ) {
        return res.status(400).json({
            message: 'Password do not match'
        });
    }

    try {
        const userExist = await User.findOne({ $or: [{ username }, { email }] });

        if (userExist) return res.status(400).json({
            message: "User alredy exist"
        });
        
        const user = await User.create({ username, email, password, role: role || 'user'});
        res.status(201).json({
            user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        token: generateToken(user)
        });
    } catch(error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        })
    }
});

router.post('/login', async (req, res)=> {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token: generateToken(user)
        })
    } catch(error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

module.exports = router;