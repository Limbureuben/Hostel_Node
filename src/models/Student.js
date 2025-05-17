const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentClass: { type: String, required: true },
    registrationNumber: { type: String, required: true, nique: true },
    registrationDate: { type: Date, defalt: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);