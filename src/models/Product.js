const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, max: 100, default: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, default: null }
}, { timestamps: true });


productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);