const { Schema, model } = require("mongoose");
const conversationSchema = new Schema(
  {
    members: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = conversation = model("conversation", conversationSchema);
