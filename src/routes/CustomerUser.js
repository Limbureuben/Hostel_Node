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
    const { email, password } = res.body;

    try {
        const user = await CustomerUser.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.json({ user: { id: user._id, name: user.name, email: user.email}, token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

module.exports = router;