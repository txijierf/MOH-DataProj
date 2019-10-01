import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let organizationTypeSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },
  organizations: [ { type: ObjectId, ref: "Organization" } ]
});

export default model("OrganizationType", organizationTypeSchema);