import express from "express";
import { verifyToken } from "../utilis/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
  updatepost,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getPosts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
