const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

export const objectSchema = {
    groupNumber: {type: Number, required: true},
    code: { type: String },
    name: {type: String, required: true},
    users: [{type: ObjectId, ref: 'User'}],
    managers: [{type: ObjectId, ref: 'User'}],
    types: [{type: ObjectId, ref: 'OrganizationType'}],
    address: String,
    contactPerson: String,
    telephone: String
}

const organizationSchema = new mongoose.Schema(objectSchema);

module.exports = mongoose.model('Organization', organizationSchema);
