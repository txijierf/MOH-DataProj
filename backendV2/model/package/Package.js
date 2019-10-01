import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let packageSchema = new Schema({
  groupNumber: { type: Number, required: true },

  // Package name
  name: { type: String, required: true },

  // If this package is published to the users.
  published: { type: Boolean, required: true, default: false },

  // Organizations this package is assigned to, could be many.
  // reference to User._id
  organizations: [ { type: ObjectId, ref: "Organization" } ],
  organizationTypes: [ { type: ObjectId, ref: "OrganizationType" } ],

  // Workbooks this package includes.
  // reference to Workbook._id
  workbooks: [ { type: ObjectId, ref: "Workbook" } ],

  // description for the workbook
  adminNotes: String,

  // Admins may provide some files, this does not include excel workbooks.
  adminFiles: [ { buffer: Buffer, name: String } ],

  editStartDate: Date, 
  editEndDate: Date, 
  reviewStartDate: Date, 
  reviewEndDate: Date, 
  approvalStartDate: Date, 
  approvalEndDate: Date,

  editors: [ { type: ObjectId, ref: "User" } ],

  // Approver and reviewer
  reviewers: [ {
    user: { type: ObjectId, ref: "User" },
    status: String,
    reason: String
  } ],

  approvers: [ {
    user: {type: ObjectId, ref: "User"},
    status: String,
    reason: String
  } ],

  approveStatus: { type: String, default: "TBD", required: true }
});

export default model("Package", packageSchema);
