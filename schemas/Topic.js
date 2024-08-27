const { Schema, model, Types } = require("mongoose");

const TopicSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
    },
    topic_title: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 70,
    },
    topic_text: {
      type: String,
      required: true,
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
    is_approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    expert_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      validate: {
        validator: async function (value) {
          if (!value) return true; // If no expert_id is provided, skip validation

          const author = await Author.findById(value);
          return author && author.is_expert;
        },
        message:
          "Expert ID provided is not valid or the author is not an expert.",
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Topic", TopicSchema);
