const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongo = require("./config/index.js");
const { authRoutes, postRoutes, userRoutes } = require("./api/routes");
const { auth } = require("./api/middlewares/");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
const PORT = process.env.PORT || 5000;

connectMongo(() => {
  http.listen(PORT);
});
let users = [];
const addUser = (user, socketId) => {
  !users.some((_user) => _user.user._id === user._id) &&
    users.push({ user, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((_user) => _user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((_user) => _user.user._id === userId);
};
io.on("connection", (socket) => {
  socket.on("online", (user) => {
    addUser(user, socket?.id);
    io.emit(
      "getOnlineUsers",
      users.map((_user) => ({ ..._user.user }))
    );
  });
  socket.on("sendMessage", ({ conversationId, from, to, message }) => {
    const user = getUser(to);
    io.to(user?.socketId).emit("getMessage", { conversationId, from, message });
  });
  socket.on("deleteMessage", ({ to, messageId }) => {
    const user = getUser(to);
    io.to(user?.socketId).emit("getDeleteMessage", {
      messageId,
    });
  });

  socket.on("sendNotification", ({ type, sender, reciever, payload }) => {
    const user = getUser(reciever);
    io.to(user?.socketId).emit("getNotification", {
      type,
      sender,
      payload,
    });
  });
  socket.on("callUser", ({ from, to, signalData }) => {
    const user = getUser(to);
    io.to(user?.socketId).emit("callUser", {
      from,
      signalData,
    });
  });
  socket.on("answerCall", ({ to, signalData }) => {
    const user = getUser(to);
    io.to(user?.socketId).emit("callAccepted", signalData);
  });
  socket.on("callEnded", ({ to }) => {
    const user = getUser(to);
    io.to(user?.socketId).emit("callEnded");
  });
  socket.on("disconnect", () => {
    removeUser(socket?.id);
    io.emit(
      "getOnlineUsers",
      users.map((_user) => ({ ..._user.user }))
    );
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.get("/welcome", auth, (req, res) => {
  res.send("Welcome ", req.user.id);
});
app.get("/", (_, res) => {
  res.send("Welcome to MediaB4U");
});
