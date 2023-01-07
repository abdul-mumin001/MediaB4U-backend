const { Post, Reply } = require("../models");
const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { commentedBy, comment } = req.body;
    const { postId } = req.params;

    let _comment = await Comment.create({
      postId,
      commentedBy,
      comment,
    });
    _comment = await _comment.populate(
      "commentedBy",
      "_id name profilePictureURL"
    );
    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $inc: {
          commentCount: 1,
        },
      }
    );
    res.json({ comment: _comment });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const updateComment = async (req, res) => {
  try {
    const { commentedBy, comment } = req.body;
    const { postId, commentId } = req.params;

    let _comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        postId,
        commentedBy,
        comment,
      },
      {
        new: true,
      }
    ).populate("commentedBy", "_id name profilePictureURL");
    // _comment = await _comment.populate(
    //   "commentedBy",
    //   "_id name profilePictureURL"
    // );

    res.json({ comment: _comment });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    await Comment.deleteOne({ commentId });
    const replies = await Reply.find({ commentId });
    await Reply.deleteMany({ commentId });
    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $inc: {
          commentCount: -1 - replies.length,
        },
      }
    );
    res.json({ commentId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { skip } = req.query;
    const comments = await Comment.find({ postId })
      .populate("commentedBy", "_id name profilePictureURL")
      .sort({ createdAt: -1 })
      .limit(5)
      .skip(skip);
    res.json({ comments });
  } catch (err) {
    console.log(err);
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addComment,
  removeComment,
  fetchAllComment,
  updateComment,
};
