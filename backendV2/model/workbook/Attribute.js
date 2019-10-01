import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let attributeSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  description: String,
  groups: [ ObjectId ]
});

export default model("Attribute", attributeSchema);