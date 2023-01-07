const { Schema, model } = require("mongoose");
const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    data: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = notification = model("notification", notificationSchema);
