const mongoose = require('mongoose');

export const objectSchema = {
  period: { type: String, required: true, unique: true }
};

const periodSchema = new mongoose.Schema(objectSchema);

export default mongoose.model('Period', periodSchema);
