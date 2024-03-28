import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';



const url='mongodb+srv://yadavlav571:Corona@mern-blog-webapp.ccan9i6.mongodb.net/Mern-Blog-WebApp?retryWrites=true&w=majority&appName=Mern-Blog-WebApp';


mongoose.connect(url)
  .then(() => {
    console.log('Connection successful');
  })
  .catch((err) => {
    console.log("Fail");
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000 ');
});

// app.get('/test',(req,res)=>{
//        res.send('Hello World');
// });

app.use('/api/user',userRoute);
app.use('/api/auth',authRoute)

