import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function signUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">

 {/*--------------------------- left-side div-----------------------------------------------------------*/}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
             via-purple-500 to-pink-500 rounded-lg text-white"
            >
              Lav's
            </span>
            Blog
          </Link>

          <p className="text-sm mt-5">
            You can sign up with your email and password or with Google
          </p>
        </div>


 {/*--------------------------- Right-Side div----------------------------------------------------------------*/}
        <div className="flex-1">

          {/*--------------------------- Right-Side Form------------------------------------*/}
          <form className="flex flex-col gap-4">
          
            <div>
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>

            <div className="">
              <Label value="Your Email" />
              <TextInput type="Email" placeholder="name@gmail.com" id="email" />
            </div>

            <div className="">
              <Label value="Your Password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign Up
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signIn" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}
