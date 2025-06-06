const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    organization_name: { type: String, required: true },
    discriptions: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true }
})

const OrganizationPackageSchema = new mongoose.Schema({
    package_name: { type: String, required: true},
    discriptions: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: String, required: true }
})

const Organization = mongoose.model('Organization', OrganizationSchema);
const Packages = mongoose.model('Packages', OrganizationPackageSchema);

module.exports = { Organization, Packages };