const { Schema, model, default: mongoose } = require("mongoose");

const SynonymSchema = new Schema(
  {
    desc_id: {
      type: Schema.Types.ObjectId,
      ref: "Description",
    },
    dict_id: {
      type: Schema.Types.ObjectId,
      ref: "Dictionary",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Synonym", SynonymSchema);
