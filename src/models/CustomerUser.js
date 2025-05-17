const mongoose = require('mongoose');

const customerUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
},
 { timestamps: true }
);

module.exports = mongoose.model('CustomerUser', customerUserSchema );