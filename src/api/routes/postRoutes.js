const express = require("express");
const { auth } = require("../middlewares");

const {
  fetchPost,
  addPost,
  deletePost,
  updatePost,
  fetchAllPostByHashTags,
  fetchAllTrendingPost,
  sortAllPostByDate,
  fetchAllPost,
} = require("../controllers/postController");
const {
  addComment,
  removeComment,
  fetchAllComment,
  updateComment,
} = require("../controllers/commentController");
const { likePost, dislikePost } = require("../controllers/likeController");
const {
  fetchAllReply,
  removeReply,
  addReply,
} = require("../controllers/replyController");

const router = express.Router();

router.get("/:postId/comments/", auth, fetchAllComment);
router.get("/trending/", auth, fetchAllTrendingPost);
router.get("/", fetchAllPost);
router.post("/:postId/comments/:commentId", auth, addReply);
router.delete("/:postId/replies/:replyId", auth, removeReply);
router.get("/comments/:commentId", auth, fetchAllReply);
router.post("/", auth, addPost);
router.get("/hashtag/:hashtag", auth, fetchAllPostByHashTags);
router.get("/sortBy=date", auth, sortAllPostByDate);
router.delete("/:postId/:postedBy", auth, deletePost);
router.get("/:postId", auth, fetchPost);
router.put("/:postId", auth, updatePost);
router.post("/:postId/comments", auth, addComment);
router.delete("/:postId/comments/:commentId", auth, removeComment);
router.put("/:postId/comments/:commentId", auth, updateComment);
router.put("/:postId/like", auth, likePost);
router.put("/:postId/dislike", auth, dislikePost);

module.exports = router;
