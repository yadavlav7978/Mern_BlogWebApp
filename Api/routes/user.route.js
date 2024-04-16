import express from "express";
import { test, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../utilis/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);

// router.get('/test',(req,res)=>{
//      res.send('Hello world');
// });

export default router;
