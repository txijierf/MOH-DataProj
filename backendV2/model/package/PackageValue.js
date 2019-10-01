import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let packageValueSchema = new Schema({
  groupNumber: { type: Number, required: true },
  package: { type: ObjectId, ref: "Package", required: true },
  organization: { type: ObjectId, ref: "Organization", required: true },
  
  // values: { catId: { attId: values } }
  
  // TODO: These should be in history. Then, if user wants to fetch the latest package submission history, get histories[length - 1]
  values: {},
  userNotes: String,
  userFiles: [ { buffer: Buffer } ],

  // TODO: Change histories to history
  // TODO: Improve design. Storing all the values per submission is expensive.
  // Submit history
  histories: [ {
    userNotes: String,
    userFiles: [ { buffer: Buffer, name: String } ],

    // TODO: Doesn't make sense to have a workbook referenced when it may have different values to values since this is a history -- values may be outdated.
    // ? Workbooks are overwritten. There's no reference to the past workbook except for values.
    workbooks: [ { type: ObjectId, ref: "Workbook" } ],
    values: {},

    submittedBy: { type: ObjectId, ref: "User" },
    date: Date
  } ]
});

export default model("PackageValue", packageValueSchema);