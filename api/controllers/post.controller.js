import prisma from "../lib/prisma.js";
import sendResponse from "../lib/responseHelper.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    res.status(200).json({
      message: "Fetched Posts Successfully",
      posts,
    });
    // console.log(posts);

    // res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to get Posts");
  }
};



// export const getPost = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const post = await prisma.post.findUnique({
//       where: { id },
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//           },
//         },
//       },
//     });
//     console.log(post);

//     const token = req.cookies?.token;
//     console.log(token, "token");
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id,
//                 userId: payload.id,
//               },
//             },
//           });
//           res.status(200).json({ ...post, isSaved: saved ? true : false });
//         }
//       });
//     }
//     res.status(200).json({ ...post, isSaved: false });
//     // sendResponse(res, 200, "Fetched Post Successfully", post);
//   } catch (error) {
//     console.log(error);
//     sendResponse(res, 500, "Failed to get Post");
//   }
// };
export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        }
      });
    } else {
      // If no token is provided, send the post without the isSaved flag
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get Post" });
  }
};

export const addPost = async (req, res) => {
  try {
    const body = req.body;
    const tokenUserId = req.userId;

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    sendResponse(res, 200, "added Post Successfully", newPost);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to add Post");
  }
};
export const addMultiplePosts = async (req, res) => {
  try {
    const posts = req.body.posts; // Expecting an array of posts
    const tokenUserId = req.userId;

    const createdPosts = await Promise.all(
      posts.map(async (post) => {
        const newPost = await prisma.post.create({
          data: {
            ...post.postData,
            userId: tokenUserId,
            postDetail: {
              create: post.postDetail,
            },
          },
        });
        return newPost;
      })
    );

    sendResponse(res, 200, "Added Posts Successfully", createdPosts);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to add Posts");
  }
};

export const updatePost = async (req, res) => {
  try {
    sendResponse(res, 200, "update Post Successfully");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to update Post");
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;

    const post = await prisma.post.findUnique({
      where: { id },
    });
    console.log(post);
    if (post.userId !== tokenUserId) {
      return sendResponse(res, 403, "You are not authorized");
    }

    await prisma.post.delete({
      where: { id },
    });
    sendResponse(res, 200, "delete Post Successfully");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to delete Post");
  }
};