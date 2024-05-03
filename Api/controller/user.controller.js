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

  try {
    let updateFields = {}; // Object to store fields to update

    // Check if username is provided and valid
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters.")
        );
      }

      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces."));
      }

      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(
          errorHandler(400, "Username cannot contain uppercase characters.")
        );
      }

      updateFields.username = req.body.username;
    }

    // Check if email is provided and valid
    if (req.body.email) {
      // Add email validation if needed
      updateFields.email = req.body.email;
    }

    // Check if profile picture is provided
    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }

    // Check if password is provided and valid
    if (req.body.password && req.body.password.length > 0) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters long.")
        );
      }

      updateFields.password = req.body.password;
    }

    //!----- Update the user document in the database with the provided data ------
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true } // Return the updated document after the update operation
    );

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

//!--------------------------- deleteUser function-----------------------------------

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user."));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User deleted successfully");
  } catch (error) {}
};

//!---------------- signout function --------------------------
{
  /* We can implement the sign-out functionality is by deleting or clearing session cookies.
  Session cookies are used to store information about a user's session, including authentication tokens or session IDs.
  When a user signs out of the application, it's a common practice to delete these session cookies to invalidate their session and log them out.*/
}

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been sign out successfully.");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createAdt: sortDirection }) // Corrected spelling here
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments(); // Corrected spelling here

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1, // Corrected spelling here
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createAdt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

//!--------------------getUser function --------------------
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
