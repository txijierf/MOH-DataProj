import { Schema, model } from "mongoose";

let sheetSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  attIds: [ Number ],
  catIds: [ Number ],
  attMap: {},
  catMap: {},
  row2Cat: {},
  col2Att: {}
});

export default model("Sheet", sheetSchema);