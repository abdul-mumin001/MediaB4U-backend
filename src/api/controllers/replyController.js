const { Reply, Post } = require("../models");

const addReply = async (req, res) => {
  try {
    const { reply, repliedBy } = req.body;
    const { commentId, postId } = req.params;
    let _reply = new Reply({ postId, reply, repliedBy, commentId });
    await _reply.save();
    _reply = await _reply.populate("repliedBy", "_id name profilePictureURL");
    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $inc: {
          commentCount: 1,
        },
      },
      { new: true }
    );
    res.json({ reply: _reply });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeReply = async (req, res) => {
  try {
    const { replyId, postId } = req.params;
    await Reply.deleteOne({ _id: replyId });
    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $inc: {
          commentCount: -1,
        },
      },
      { new: true }
    );

    res.json({ replyId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchAllReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const replies = await Reply.find({ commentId }).populate(
      "repliedBy",
      "_id name profilePictureURL"
    );
    res.json({ replies });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

module.exports = {
  addReply,
  removeReply,
  fetchAllReply,
};
