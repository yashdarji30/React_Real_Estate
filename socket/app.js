// import { Server } from "socket.io";
// console.log("started");
// const io = new Server(8081, {
//   cors: {
//     origin: "http://localhost:5173", // Ensure this matches your client URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExists = onlineUser.find((user) => user.userId === userId);
//   if (!userExists) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log(onlineUser);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log("User disconnected", socket.id);
//   });
// });

import { Server } from "socket.io";

console.log("started");
const io = new Server(8081, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your client URL
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