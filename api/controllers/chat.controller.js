import prisma from "../lib/prisma.js";
import sendResponse from "../lib/responseHelper.js";

// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     const chats = await prisma.chat.findMany({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//     });

//     for (const chat of chats) {
//       const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

//       const receiver = await prisma.user.findUnique({
//         where: {
//           id: receiverId,
//         },
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       });
//       chat.receiver = receiver;
//     }

//     res.status(200).json(chats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    const receiverIds = chats
      .map((chat) => chat.userIDs.find((id) => id !== tokenUserId))
      .filter(Boolean);

    const receivers = await prisma.user.findMany({
      where: {
        id: { in: receiverIds },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    const receiversMap = receivers.reduce((acc, receiver) => {
      acc[receiver.id] = receiver;
      return acc;
    }, {});

    const enrichedChats = chats.map((chat) => {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      return {
        ...chat,
        receiver: receiversMap[receiverId] || null,
      };
    });

    res.status(200).json(enrichedChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  // console.log("In get Chat");
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    // console.log(chat);
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// export const addChat = async (req, res) => {
//   console.log("here");
//   const tokenUserId = req.userId;

//   console.log(req.body.receiverId);
//   try {
//     const newChat = await prisma.chat.create({
//       data: {
//         userIDs: [tokenUserId, req.body.receiverId],
//       },
//     });
//     res.status(200).json(newChat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add chat!" });
//   }
// };

export const addChat = async (req, res) => {
  console.log("Hello")
  console.log(req.body);
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;
  console.log(receiverId)

  try {
    // Check if a chat already exists between the two users
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId], // Check if both user IDs are in the userIDs array
        },
      },
    });

    if (existingChat) {
      // If a chat already exists, return the existing chat
      return res.status(200).json(existingChat);

 
    } else {
      // If no chat exists, create a new chat
      const newChat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, receiverId],
        },
      });
      return res.status(200).json(newChat);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};