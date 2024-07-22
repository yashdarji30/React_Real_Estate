
import jwt from "jsonwebtoken";
import sendResponse from "../lib/responseHelper.js";

export const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) return sendResponse(res, 401, "Not Authenticated!");

  // Assuming the token is sent as a Bearer token in the Authorization header
  const token = authHeader.split(" ")[1]; // Remove the "Bearer " part

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.log(err);
      return sendResponse(res, 403, "Token is not valid");
    }
    req.userId = payload.id;
    next();
  });
};
