const { Schema, model, Types } = require("mongoose");

const GuestSchema = new Schema(
  {
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    os: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    device: {
      type: String,
      trim: true,
    },
    browser: {
      type: String,
      required: true,
      trim: true,
    },
    reg_date: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Guest", GuestSchema);
