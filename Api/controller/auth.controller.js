import user from '../models/user.model.js';
import {errorHandler} from '../utilis/error.js';

export const signup=async(req,res,next)=>{

    const {username,email,password}=req.body;

    if(!username || !email || !password || username==='' || email==='' || password===''){
        return next(errorHandler(400,'All fields are required'));
    }

    const newUser=new user({
        username,
        email,
        password,
    });

 try{
    await newUser.save();
    res.json('signUp success');

 }catch(error){
     next(error);
 }
  
};