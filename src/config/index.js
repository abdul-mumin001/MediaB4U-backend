const mongoose = require("mongoose");
const connectMongo = (callback) => {
  mongoose.connect(
    process.env.MONGO_DB_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err, data) => {
      if (err) console.log("err", err);
      else callback();
    }
  );
};

module.exports = connectMongo;
