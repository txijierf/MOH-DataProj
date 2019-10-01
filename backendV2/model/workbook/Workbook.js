import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let workbookSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true, unique: true },
  sheets: [ { type: ObjectId, ref: "Sheet" } ],

  // File in base 64 encoding
  file: { type: String, required: true },

  // values : { cat : { att : value } }
  // Does not save read-only fields
  values: {}, 

  // Read-only
  roAtts: { type: Array, default: [] },
  roCats: { type: Array, default: [] }
});

export default model("Workbook", workbookSchema);