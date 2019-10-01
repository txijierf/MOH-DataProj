import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let categorySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  groups: [ ObjectId ]
});

export default model("Category", categorySchema);