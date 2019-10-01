import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let organizationSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  users: [ { type: ObjectId, ref: "User" } ],
  types: [ { type: ObjectId, ref: "OrganizationType" } ]
});

export default model("Organization", organizationSchema);
