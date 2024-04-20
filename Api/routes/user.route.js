import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signout,
} from "../controller/user.controller.js";
import { verifyToken } from "../utilis/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
// "Post" request is used to send user information (such as a user ID or session token) that necessary for clearing a session.

export default router;
