import prisma from "../lib/prisma.js";
import sendResponse from "../lib/responseHelper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    sendResponse(res, 200, "successfully fetched users", users);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, " Failed to get users !");
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    sendResponse(res, 200, "successfully fetched user", user);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, " Failed to get user !");
  }
};

export const updateUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    console.log(id);
    console.log(tokenUserId);
    if (id !== tokenUserId) {
      return sendResponse(res, 403, "Not Authorized !");
    }
    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, " Failed to update user !");
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
      return sendResponse(res, 403, "Not Authorized !");
    }

    await prisma.user.delete({
      where: { id },
    });
    sendResponse(res, 200, "User Deleted Successfully");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, " Failed to Delete user  !");
  }
};
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    // Check if the saved post already exists
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    // If it exists, delete it
    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      sendResponse(res, 200, "Post removed from saved list");
    } else {
      // If it doesn't exist, create a new saved post
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      sendResponse(res, 200, "Post saved successfully");
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed to save post");
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};