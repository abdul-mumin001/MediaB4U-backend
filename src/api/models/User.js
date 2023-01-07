const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: isURL } = require("validator/lib/isURL");
const userSchema = new Schema(
  {
    name: {
      index: true,
      type: String,
      minlength: [5, "Name should be atleast of 5 characters."],
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      unique: [true, "Email is already taken."],
      required: [true, "Email is required."],
      validate: (value) => isEmail(value),
      index: true,
    },
    profilePictureURL: {
      type: String,
      validate: (value) => isURL(value),
    },
    coverPictureURL: {
      type: String,
      validate: (value) => isURL(value),
    },
    bio: {
      type: String,
      minlength: [10, "Bio should be atleast of 10 characters."],
    },
    portfolioUrl: {
      type: String,
      validate: (value) => isURL(value),
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password length must be 6 atleast."],
    },
    token: {
      type: String,
    },
    draftPosts: {
      type: [Schema.Types.ObjectId],
      ref: "post",
    },
    archivedPosts: {
      type: [Schema.Types.ObjectId],
      ref: "post",
    },
    bookmarkedPosts: {
      type: [Schema.Types.ObjectId],
      ref: "post",
    },
    stories: {
      type: [Schema.Types.ObjectId],
    },
    hashTagsFollowed: {
      type: [String],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
  },

  {
    timestamps: true,
  }
);

userSchema.index({ name: "text", email: "text" }, { sparse: true });
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_TOKEN_KEY
      );
      user.token = token;
      user.password = undefined;

      return user;
    } else {
      throw Error("Wrong password");
    }
  } else {
    throw Error("Incorrect email");
  }
};
userSchema.statics.signup = async function (name, email, password) {
  const isuserExist = await this.findOne({ email });
  if (isuserExist) {
    throw Error("User already exist. Please login");
  }

  const user = await this.create({
    name,
    email: email.toLowerCase(),
    password,
  });
  user.password = undefined;

  const token = jwt.sign(
    { id: user._id, email: email.toLowerCase() },
    process.env.JWT_TOKEN_KEY
  );
  user.token = token;
  return user;
};

module.exports = user = model("user", userSchema);
