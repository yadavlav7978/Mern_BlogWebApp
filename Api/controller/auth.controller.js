import user from '../models/user.model.js';
import {errorHandler} from '../utilis/error.js';
import jwt from 'jsonwebtoken';


export const signup=async(req,res,next)=>{

    const {username,email,password}=req.body;
    console.log(password);

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

export const signin = async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await user.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

       
        if (password!=validUser.password) {
            return next(errorHandler(400, 'Invalid Password'));
        }

        // Secret key known only to the server
        const secretKey = 'lav571';

              {/*  jwt.sign() allows us to create a secure token containing user information, 
           which can be sent to the client and later used by the server to authenticate and authorize the user */}

        // Generating JWT token with user ID as payload and signing it with the secret key
        const token = jwt.sign({ id: validUser._id }, secretKey);

        // Sending the token in a cookie named 'access_token'
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(validUser);
    } catch (error) {
        next(error);
    }
};

