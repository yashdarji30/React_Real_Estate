import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import sendResponse from "../lib/responseHelper.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

// export const register = async (req, res) => {
//   console.log("here");
//   try {
//     const { username, email, password } = req.body;
//     // hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);
//     // Create a new user and save to DB
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//       },
//     });
//     console.log(newUser);

//     sendResponse(res, 201, "User Create Successfully");
//   } catch (error) {
//     console.log(error);

//     sendResponse(res, 500, "Failed to create the User");
//   }
// };

export const register = async (req, res) => {
  console.log("here");
  try {
    const { username, email, password } = req.body;
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Create a new user and save to DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);

    sendResponse(res, 201, "User Created Successfully");
  } catch (error) {
    console.log(error);

    sendResponse(res, 500, "Failed to create the User");
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return sendResponse(res, 401, "Invalid Credentials");
    }

    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid Credentials");
    }

    // Generate JWT token and send it in the response body
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    res.status(200).json({ token, userInfo });
  } catch (error) {
    console.log(error);
    sendResponse(res, 401, "Failed to login");
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout Success" });
};