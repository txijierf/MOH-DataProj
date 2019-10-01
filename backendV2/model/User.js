import { Schema, model } from "mongoose";

import passportLocalMongoose from "passport-local-mongoose";

let userSchema = new Schema({
    username: { type: String, lowercase: true, unique: true, required: true },
    firstName: String,
    lastName: String,
    createDate: { type: Date, default: Date.now, required: true },
    phoneNumber: String,
    organization: { type: String, required: true },
    validated: { type: Boolean, required: true, default: false },
    email: { type: String, unique: true, required: true },
    groupNumber: { type: Number, required: true },
    active: { type: Boolean, required: true, default: true }, // you can disable a user
    permissions: { type: Array } // 'admin-add-workbook', 'admin-add-attribute', ...

});

// embed passport functions
userSchema.plugin(passportLocalMongoose, {
    // filter disabled user
    findByUsername: (model, queryParameters) => {
      // Add additional query parameter - AND condition - active: true
      queryParameters.active = true;
      return model.findOne(queryParameters);
    }
});

export default model("User", userSchema);
