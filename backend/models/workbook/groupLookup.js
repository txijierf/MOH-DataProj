const mongoose = require('mongoose');

module.exports = mongoose.model('GroupLookup',
    new mongoose.Schema({
        title: {type: String, required: true, unique: true},
        values: {type: Array, default: []}
    }));
