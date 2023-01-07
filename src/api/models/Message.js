const { Schema, model } = require("mongoose");
const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: [true, "conversationId can't be empty."],
      ref: "conversation",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = message = model("message", messageSchema);
