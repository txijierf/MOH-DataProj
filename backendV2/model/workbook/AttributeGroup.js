import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let attributeGroupSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  parent: ObjectId,
  children: [ ObjectId ]
});

export default model("AttributeGroup", attributeGroupSchema);