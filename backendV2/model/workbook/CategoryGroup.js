import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

let categoryGroupSchema = new Schema({
  groupNumber: { type: Number, required: true },
  name: { type: String, required: true },

  // TODO: Improve design... This is bad. We don't need to know both parent and children
  // Can probably do : { parent, child: { ... } }, where we only have an entry for the root parent
  parent: ObjectId,
  children: [ ObjectId ]
});

export default model("CategoryGroup", categoryGroupSchema);