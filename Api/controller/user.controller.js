import { errorHandler } from "../utilis/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.send("Hello world");
};

export const updateUser = async (req, res, next) => {
  // This will checks whether the authenticated user ID (req.user.id) matches the user ID specified in the request parameters (req.params.userId).
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user."));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long.")
      );
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters.")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(
        errorHandler(400, "User can not contain lowercase characters")
      );
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(
        errorHandler(400, "User can not contain uppercase characters")
      );
    }

    if (!req.body.password.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Password can only contain letters and numbers")
      );
    }

    try {
      //!----- Update the user document in the database with the provided data ------
      const updateUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePictures,
            password: req.body.password,
          },
        },
        { new: true } // Return the updated document after the update operation
      );
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  }
};
