import { Schema, model } from "mongoose";

const groupSchema = new Schema({
    groupNumber: { type: Number, required: true },
    name: { type: String, required: true, unique: true }
});

export default model("Group", groupSchema);
