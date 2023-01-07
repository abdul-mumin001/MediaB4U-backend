const { Schema, model } = require("mongoose");
const mediaUrlSchema = new Schema({
  url: {
    type: String,
  },
  type: {
    type: String,
  },
});
module.exports = comment = model("mediaURL", mediaUrlSchema);
