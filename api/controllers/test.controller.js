import jwt from "jsonwebtoken";
import sendResponse from "../lib/responseHelper.js";
import "dotenv/config";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);

  sendResponse(res, 200, "You are authenticated");
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return sendResponse(res, 401, "Not Authenticated ! ");

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return sendResponse(res, 403, "Token is not valid");

    if (!payload.isAdmin) {
      return sendResponse(res, 403, "Not authorized");
    }
  });

  sendResponse(res, 200, "You are authenticated");
};