const mongoose = require('mongoose');

export const objectSchema = {
  name: { type: String, required: true, unique: true }
};

const formSchema = new mongoose.Schema(objectSchema);

export default mongoose.model('Form', formSchema);
