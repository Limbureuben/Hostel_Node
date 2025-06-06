const express = require('express');
const { Organization, Packages } = require('../models/Organization')
require('dotenv').config();

const router = express.Router();

router.post('/registerorganization', async (req, res) => {
    const { organization_name, discriptions, contact, location } = req.body;

    try {
        const newOrganization = await Organization.create({
            organization_name,
            discriptions,
            contact,
            location
        });

        res.status(201).json({
            organization: {
                id: newOrganization._id,
                name: newOrganization.organization_name,
                location: newOrganization.location
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Organization registration failed',
            error: error.message
        });
    }
});

router.post('/registerpackage', async (req, res) => {
    const { package_name, discriptions, link, price } = req.body;

    try {
        const newPackage = await Packages.create({
            package_name,
            discriptions,
            link,
            price
        });

        res.status(201).json({
            package: {
                id: newPackage._id,
                name: newPackage.package_name,
                link: newPackage.link,
                price: newPackage.price
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to register the package',
            error: error.message
        });
    }
});
module.exports = router;