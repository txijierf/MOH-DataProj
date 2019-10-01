import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let valueSchema = new Schema({
  grouptNumber: { type: Number, required: true },
  organization: { type: ObjectId, ref: "Organization" },

  // values: { catId: { attId: value } }
  values: {} 
});

export default model("Value", valueSchema);