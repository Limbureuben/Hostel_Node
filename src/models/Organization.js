const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    organization_name: { type: String, required: true },
    discriptions: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    logo: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

})

const OrganizationPackageSchema = new mongoose.Schema({
    package_name: { type: String, required: true},
    discriptions: { type: String, required: true },
    link: { type: String, required: true },
    logo: { type: String },
    price: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Organization = mongoose.model('Organization', OrganizationSchema);
const Packages = mongoose.model('Packages', OrganizationPackageSchema);

module.exports = { Organization, Packages };