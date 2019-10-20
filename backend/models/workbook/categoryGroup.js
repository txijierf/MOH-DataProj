const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model('CategoryGroup',
    new mongoose.Schema({
        groupNumber: {type: Number, required: true},
        name: {type: String, required: true},
        parent: ObjectId, 
        children: [ObjectId], 
        properties: { type: Array, default: [] }
    }));
