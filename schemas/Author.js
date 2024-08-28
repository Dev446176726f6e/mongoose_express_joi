const { Schema, model, Types } = require("mongoose");

const AuthorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minLength: 1,
      maxLength: 30,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minLength: 1,
      maxLength: 30,
    },
    nick_name: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
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
    info: {
      type: String,
      default: "Not Info",
      trim: true,
      minLength: 3,
      maxLength: 250,
    },
    position: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "No Photo",
      trim: true,
    },
    is_expert: {
      type: Boolean,
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

module.exports = model("Author", AuthorSchema);
