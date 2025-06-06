const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

router.post('/register', async (req, res)=> {
    const { username, email, password, confirmPassword } = req.body;

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

        const user = await User.create({ username, email, password });
        res.status(201).json({
            user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        token: generateToken(user)
        });
    } catch(error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        })
    }
})