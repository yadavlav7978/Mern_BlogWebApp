import express from 'express';
import mongoose from 'mongoose';


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

app.listen(3000, () => {
  console.log('Server is running on port 3000 !!');
});
