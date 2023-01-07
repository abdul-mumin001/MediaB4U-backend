const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {
  try {
    const { id: from } = req.params;
    const { to, content } = req.body;
    let conversation = await Conversation.findOne({}).or([
      { members: [from, to] },
      { members: [to, from] },
    ]);
    if (!conversation) {
      conversation = await Conversation.create({
        members: [from, to],
      });
    } else {
      await Conversation.updateOne(
        { $or: [{ members: [from, to] }, { members: [to, from] }] },
        { members: [from, to] }
      );
    }

    let message = new Message({
      conversationId: conversation._id,
      sender: from,
      content,
    });
    message = await message.save();
    message = await message.populate("sender", "_id name profilePictureURL");

    res.json({ message });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const removeMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.deleteOne({ _id: messageId });

    res.json({ messageId });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("sender", "_id name profilePictureURL")
      .sort({
        createdAt: 1,
      });

    res.json({ messages });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};

const fetchAllConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversations = await Conversation.find({
      members: { $in: [id] },
    })
      .populate("members", "_id name profilePictureURL")
      .sort({ updatedAt: -1 });
    res.json({ conversations });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const fetchConversationInfo = async (req, res) => {
  try {
    const { id: from, to } = req.params;
    const conversation = await Conversation.findOne({})
      .or([{ members: [from, to] }, { members: [to, from] }])
      .populate("members", "_id name profilePictureURL");

    res.json({ conversation });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
const createConversation = async (req, res) => {
  try {
    const { id: from, to } = req.params;
    let conversation = new Conversation({ members: [to, from] });
    conversation = await conversation.save();
    conversation = await conversation.populate(
      "members",
      "_id name profilePictureURL"
    );
    res.json({ conversation });
  } catch (err) {
    res.status(404).json({ errors: [err.message.split(",")] });
  }
};
module.exports = {
  sendMessage,
  removeMessage,
  fetchAllMessage,
  fetchAllConversation,
  fetchConversationInfo,
  createConversation,
};
