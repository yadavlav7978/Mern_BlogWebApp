import express from "express";
import { verifyToken } from "../utilis/verifyUser.js";
import {
  createComment,
  getPostComments,
} from "../controller/comment.controller.js";

const router = express.Router();
router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
export default router;
