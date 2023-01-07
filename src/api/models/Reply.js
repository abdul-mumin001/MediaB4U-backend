const { Schema, model } = require("mongoose");
const replySchema = new Schema({
  reply: {
    type: String,
  },
  postId: {
    type: String,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
  repliedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = reply = model("reply", replySchema);
