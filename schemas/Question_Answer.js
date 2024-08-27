const { Schema, model, Types } = require("mongoose");

const QuestionAnswerSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 250,
    },
    answer: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 250,
    },
    created_date: {
      type: Date,
    },
    updated_date: {
      type: Date,
    },
    is_checked: {
      type: Boolean,
      required: true,
      default: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expert_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("QuestionAnswer", QuestionAnswerSchema);
