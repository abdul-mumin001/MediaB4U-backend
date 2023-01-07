const { Schema, model } = require("mongoose");
const replySchema = require("./Reply");

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
    },
    comment: {
      type: String,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = comment = model("comment", commentSchema);
