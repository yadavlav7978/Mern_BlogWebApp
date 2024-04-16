import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

//!------ Middleware function to verify the user with the help of JWT token provided in the request

export const verifyToken = (req, res, next) => {
  // Extract the JWT token from the request cookies

  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const secretKey = "lav571";

  // Verify the JWT token using the secret key

  jwt.verify(token, secretKey, (err, user) => {
    // Check for errors during token verification
    if (err) {
      // If verification fails, return a 401 Unauthorized error
      return next(errorHandler(401, "Unauthorized"));
    }
    // If verification is successful, attach the user object from the token to the request object
    req.user = user;

    // Call the next middleware function in the chain
    next();
  });
};
