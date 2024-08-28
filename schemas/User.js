const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minLength: 1,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxLength: 100,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 50,
      // match:
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    info: {
      type: String,
      default: "Not Info",
      trim: true,
      minLength: 3,
      maxLength: 250,
    },
    photo: {
      type: String,
      default: "No Photo",
      trim: true,
    },
    created_date: {
      type: Date,
      required: true,
    },
    updated_date: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    token: { type: String },
    activation_link: String,
  },
  {
    versionKey: false,
  }
);

module.exports = model("User", UserSchema);
