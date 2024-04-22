import express from "express";
import { verifyToken } from "../utilis/verifyUser.js";
import { create, getPosts } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getPosts", getPosts);

export default router;
