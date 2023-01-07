const { User } = require("../models");

const followUser = async (req, res) => {
  try {
    const { followingId, followerId } = req.params;
    if (followingId !== followerId) {
      await User.findOneAndUpdate(
        { _id: followingId },
        { $push: { followers: followerId } }
      );
      await User.findOneAndUpdate(
        { _id: followerId },
        { $push: { following: followingId } }
      );
      res.json({ followingId });
    } else {
      res.json("Can't follow yourself");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const unFollowUser = async (req, res) => {
  try {
    const { followingId, followerId } = req.params;
    if (followingId !== followerId) {
      await User.findOneAndUpdate(
        { _id: followingId },
        { $pull: { followers: followerId } }
      );
      await User.findOneAndUpdate(
        { _id: followerId },
        { $pull: { following: followingId } }
      );
      res.json({ followingId });
    } else {
      res.json("Can't unfollow yourself");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = { followUser, unFollowUser };
