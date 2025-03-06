const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true }, // Keeping 'lon' as per original code
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // Fixed reference
});

module.exports = mongoose.model('Place', placeSchema);
