const express = require('express');
const Organization = '../models/Organization.js'
require('dotenv').config();

const router = express.Router();

router.post('/addorganization', async(res, req) => {
    const { organization_name, discriptions, contact, location } = req.body;

   try {
     const newOrganization = await Organization.create({
        organization_name,
        discriptions,
        contact,
        location
    });
    res.status(201).json({ organization: { id: newOrganization.organization_id, name: newOrganization.organization_name, location: newOrganization.location} });
   } catch (error) {
    res.status(500).json({
        message: 'Organization registration failed',
        error: error.message
    })
   }
})

module.exports = router;