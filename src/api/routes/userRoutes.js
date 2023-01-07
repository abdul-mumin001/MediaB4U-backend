const express = require("express");
const { auth } = require("../middlewares");
const {
  fetchAllPostByUserId,
  fetchAllUserPost,
  fetchAllUserArchivedPost,
  fetchAllUserBookmarkedPost,
  fetchAllUserDraftPost,
  addPostToArchived,
  addPostToDraft,
  addPostToBookmarked,
  removePostFromArchived,
  removePostFromBookmarked,
  removePostFromDraft,
  sortAllUserPostByDate,
  fetchAllTrendingUserPost,
} = require("../controllers/postController");
const { followUser, unFollowUser } = require("../controllers/followController");
const {
  getUserInfo,
  updateUserProfile,
  getFollowing,
  getFollowers,
  searchFollowers,
} = require("../controllers/authController");
const {
  fetchAllMessage,
  sendMessage,
  removeMessage,
  fetchAllMessagesInfo,
  fetchAllConversation,
  fetchConversationInfo,
  createConversation,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/", auth, searchFollowers);
router.get("/:postedBy/posts", auth, fetchAllPostByUserId);
router.get("/:postedBy/posts/sortBy=date", auth, sortAllUserPostByDate);
router.get("/:postedBy/posts/trending", auth, fetchAllTrendingUserPost);
router.put("/:followerId/follow/:followingId", auth, followUser);
router.put("/:followerId/unfollow/:followingId", auth, unFollowUser);
router.get("/posts", auth, fetchAllUserPost);
router.get("/profile/:id", auth, getUserInfo);
router.put("/profile/:id", auth, updateUserProfile);
router.get("/:id/posts/archived/", auth, fetchAllUserArchivedPost);
router.get("/:id/posts/bookmarked", auth, fetchAllUserBookmarkedPost);
router.get("/:id/posts/draft", auth, fetchAllUserDraftPost);
router.put("/:id/posts/archived/", auth, addPostToArchived);
router.put("/:id/posts/bookmarked/", auth, addPostToBookmarked);
router.put("/:id/posts/draft/", auth, addPostToDraft);
router.delete("/:id/posts/archived/:postId", auth, removePostFromArchived);
router.delete("/:id/posts/bookmarked/:postId", auth, removePostFromBookmarked);
router.delete("/:id/posts/draft/:postId", auth, removePostFromDraft);

router.get("/:id/followers", auth, getFollowers);
router.get("/:id/following", auth, getFollowing);
router.post("/:id/messages", auth, sendMessage);
router.get("/:id/conversations", auth, fetchAllConversation);
router.post("/:id/conversations/:to", auth, createConversation);
router.get("/:id/conversations/:from", auth, fetchConversationInfo);
router.get("/:id/messages/:conversationId", auth, fetchAllMessage);
router.delete("/:id/messages/:messageId", auth, removeMessage);

module.exports = router;
