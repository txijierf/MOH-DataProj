const mongoose = require('mongoose');

export const objectSchema = {
  year: { type: Number, required: true, unique: true }
};

const yearSchema = new mongoose.Schema(objectSchema);

export default mongoose.model('Year', yearSchema);
