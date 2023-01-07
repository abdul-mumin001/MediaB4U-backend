const { User } = require("../models");
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    if (user) {
      res.json({
        user,
      });
    }
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.signup(name, email, password);
    res.json({
      user,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const getUserInfo = async (req, res) => {
  let { id } = req.params;
  try {
    const profile = await User.findById(id).select(
      "-password -draftPosts -archivedPosts -bookmarkedPosts"
    );
    res.json({
      profile,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const updateUserProfile = async (req, res) => {
  let { id } = req.params;
  let { name, bio, portfolioUrl, profilePictureURL, coverPictureURL } =
    req.body;
  try {
    const profile = await User.findByIdAndUpdate(
      id,
      {
        name,
        bio,
        portfolioUrl,
        profilePictureURL,
        coverPictureURL,
      },
      { new: true }
    ).select("-password -draftPosts -archivedPosts -bookmarkedPosts");
    res.json({
      profile,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};

const getFollowers = async (req, res) => {
  let { id } = req.params;
  try {
    const followers = await User.findById(id)
      .select("followers")
      .populate("followers", "_id name profilePictureURL");
    res.json({
      followers,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const getFollowing = async (req, res) => {
  let { id } = req.params;
  try {
    const following = await User.findById(id)
      .select("following")
      .populate("following", "_id name profilePictureURL ");
    res.json({
      following,
    });
  } catch (err) {
    res.status(401).json({ errors: [err.message.split(",")] });
  }
};
const searchFollowers = async (req, res) => {
  let { search, skip } = req.query;
  let users;
  if (search !== "undefined") {
    users = await User.find(
      {
        $text: {
          $search: search,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .select("-password -draftPosts -archivedPosts -bookmarkedPosts")
      .limit(5)
      .skip(skip);
  } else {
    const user = await User.findById(req.user.id);
    users = await User.find({ _id: { $nin: [user?._id, ...user.following] } })
      .sort({ createdAt: -1 })
      .select("-password -draftPosts -archivedPosts -bookmarkedPosts")
      .limit(5)
      .skip(skip);
  }
  res.json({ users });
};
module.exports = {
  loginController,
  signupController,
  getUserInfo,
  updateUserProfile,
  getFollowers,
  getFollowing,
  searchFollowers,
};
