const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomerUser = require('../models/CustomerUser');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const existing = await CustomerUser.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const MatchPassword = password === confirmPassword;
        if (!MatchPassword) return res.status(400).json({ message: 'Passwords do not match' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await CustomerUser.create({
            name,
            email,
            password: hashedPassword
        });
        
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email }, token});
    
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    
})