const { Schema, model } = require("mongoose");

const DescSchema = new Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      trim: true,
      minLenght: 10,
      maxLength: 150,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Description", DescSchema);
