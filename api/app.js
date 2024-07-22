import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("<h1>Hello There this is backend of chirag project</h1>");
});

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  } else {
    userExists.socketId = socketId;
  }
  io.emit("userStatus", { userId, online: true });
};

const removeUser = (socketId) => {
  const user = onlineUsers.find((user) => user.socketId === socketId);
  if (user) {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
    io.emit("userStatus", { userId: user.userId, online: false });
  }
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUsers);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected", socket.id);
  });
});

// Listen on the same port for both Express and Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});