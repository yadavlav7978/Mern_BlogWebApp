// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXY5WFCoAosR9OGjACaFda-fAxIf09Y8A",
  authDomain: "mern-blogwebapp.firebaseapp.com",
  projectId: "mern-blogwebapp",
  storageBucket: "mern-blogwebapp.appspot.com",
  messagingSenderId: "225036982427",
  appId: "1:225036982427:web:f63f1a9be23c072d604e3e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);