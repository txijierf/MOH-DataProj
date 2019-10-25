const mongoose = require('mongoose');

export const objectSchema = {
  number: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true }
};

const facilitySchema = new mongoose.Schema(objectSchema);

export default mongoose.model('Facility', facilitySchema);
