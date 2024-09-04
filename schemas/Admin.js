const { Schema, model, Types } = require("mongoose");

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
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
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phone: {
      type: String,
      trim: true,
      match:
        /^(?:\+998|998)?[-.\s]?\(?\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      // match:
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    is_creator: {
      type: Boolean,
      required: true,
    },
    created_date: {
      type: Date,
    },
    updated_date: {
      type: Date,
    },
    token: { type: String },
    activation_link: String,
  },
  {
    versionKey: false,
  }
);

module.exports = model("Admin", AdminSchema);
