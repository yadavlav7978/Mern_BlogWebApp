import express from "express";
import {test} from '../controller/user.controller.js'


const router=express.Router();

router.get('/test',test);

// router.get('/test',(req,res)=>{
//      res.send('Hello world');
// });

export default router;