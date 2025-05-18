const express = require('express');
const Student = require('../models/Student');


const router = express.Router();

router.post('/addStudent', async (req, res) => {
    const { studentName, studentClass, registrationNumber } = req.body;

    try{
        const existingNumber = await Student.findOne({ registrationNumber });

        if(existingNumber) {
            return res.status(400).json({ message: 'Registration number alredy exists '});
        }

        const newStudent = await Student.create({
            studentName,
            studentClass,
            registrationNumber
        });
        res.status(201).json({ student: { id: newStudent._id, studentName: newStudent.studentName, studentClass: newStudent.studentClass, registrationNumber: newStudent.registrationNumber }});
    } catch (error) {
        res.status(500).json({ message: 'Student registration failed', error: error.message });
    }
});

module.exports = router;