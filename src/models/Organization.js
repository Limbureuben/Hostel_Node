const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    organization_name: { type: String, required: true },
    discriptions: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true }
})

model.exports = mongoose.model('Organization', OrganizationSchema);