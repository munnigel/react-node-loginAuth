const mongoose = require('mongoose');

const ImageLogSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImageLog', ImageLogSchema);
