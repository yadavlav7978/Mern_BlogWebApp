import user from "../models/user.model.js";
import { errorHandler } from "../utilis/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const newUser = new user({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
    res.json("signUp success");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await user.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    if (password != validUser.password) {
      return next(errorHandler(400, "Invalid Password"));
    }

    // Secret key known only to the server
    const secretKey = "lav571";

    {
      /*  jwt.sign() allows us to create a secure token containing user information, 
           which can be sent to the client and later used by the server to authenticate and authorize the user */
    }

    // Generating JWT token with user ID as payload and signing it with the secret key
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      secretKey
    );

    // Sending the token in a cookie named 'access_token'
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(validUser);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    // Check if user already exists
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      // User exists, generate JWT token
      const secretKey = "lav571";
      const token = jwt.sign(
        { id: existingUser._id, isAdmin: existingUser.isAdmin },
        secretKey
      );

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(existingUser);
    } else {
      // User doesn't exist, create a new user
      const generatedPassword = Math.random().toString(36).slice(-8); // Generate Random Password

      const newUser = new user({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: generatedPassword, // Assign generated password
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      // Generate JWT token
      const secretKey = "lav571";
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        secretKey
      );
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    // Handle errors

    res.status(500).json({ message: "Internal server error" });
  }
};

//!----------------------------------------- JSON web Token----------------------------------------------------------------
{
  /*
    JSON web Token is used to authenticate the user and also help in signIn without requiring users to repeatedly enter their username and password.
    How its works?
    1) During login, the user enters their credentials (username/password). The server validates them. 
       Upon successfully logs in, the server generates a JWT token.
    2) This token contains a payload with user information (often the user's ID) and a signature or we can say that secret key.  
    2) Then server sends the JWT token back to the client. This token can be stored securely in a cookie or local storage named "access_token".
    3) With each subsequent request to the server that needs authentication, the client used this JWT token to authorize and  does not repeatedly enter their username and password.

*/
}
