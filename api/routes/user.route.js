
import express from "express";
import {
  deleteUsers,
  getNotificationNumber,
  getUser,
  getUsers,
  profilePosts,
  savePost,
  updateUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/all", getUsers);

// router.get("/:id", getUser);

router.put("/:id", verifyToken, updateUsers);

router.delete("/:id", verifyToken, deleteUsers);

router.post("/save", verifyToken, savePost);

router.get("/profilePosts", verifyToken, profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;
