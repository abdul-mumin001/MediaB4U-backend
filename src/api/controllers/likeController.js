const { Post } = require("../models");

const likePost = async (req, res) => {
  try {
    const { likedBy, postedBy } = req.body;
    const { postId } = req.params;

    if (likedBy !== postedBy) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: likedBy } },
        {
          new: true,
        }
      );
      res.json({ postId });
    } else {
      res.status(401).json("Can't like your own post");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const dislikePost = async (req, res) => {
  try {
    const { dislikedBy, postedBy } = req.body;

    const { postId } = req.params;
    if (dislikedBy !== postedBy) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: dislikedBy } },
        {
          new: true,
        }
      );
      res.json({ postId });
    } else {
      res.status(401).json("Can't dislike your own post");
    }
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = { likePost, dislikePost };
