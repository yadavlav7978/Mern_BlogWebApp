import user from '../models/user.model.js'

export const signup=async(req,res)=>{

    const {username,email,password}=req.body;

    if(!username || !email || !password || username==='' || email==='' || password===''){
        return res.status(400).json({message:"All fields are required"});
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
     res.status(500).json({message:error.message});
 }
  
};