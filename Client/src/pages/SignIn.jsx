import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signInStart,signInSuccess,signInFailure,} from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import OAuth from "../components/OAuth";

export default function signIn() {

  const [formData, setformData] = useState({});

  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);

  // Above two line of code can be replaced by this line
  const {loading,error:errorMessage}=useSelector((state)=>state.user);
 

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    // Update the form data with the new value
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  //!---------------------------------- Function to Handle Form Submission----------------------------------------------------------

  // Function to handle form submission asynchronously
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }

    try {
     dispatch(signInStart());

      // Send a POST request to the server to sign up the user
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set request headers
        body: JSON.stringify(formData), // Convert form data to JSON and send in the request body
      });

      const data = await res.json(); // Parse the response data as JSON

      if (data.success === false) {
        // If the request was unsuccessful, set the error message based on the response
        //return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        // If the response is successful, navigate to the '/signIn' route
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      // Handle any errors that occur during the fetch operation
      //setErrorMessage(err.message);
      //setLoading(false);

      dispatch(signInFailure(err.message));
    }
  };

  {
    /*//!-----------------------------------------------------------------------------------------------------------*/
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/*//!--------------------------- left-side div---------------------------------------------*/}

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
            You can sign In with your email and password or with Google
          </p>
        </div>

        {/*//!--------------------------- Right-Side div-----------------------------*/}
        <div className="flex-1">
          {/*--------------------------- Right-Side Form------------------------------------*/}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your Email" />
              <TextInput
                type="Email"
                placeholder="name@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
            </div>
            {/*//!--------------- Sign-In Button -----------------------*/}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              // Disable the button when loading state is true
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                " Sign In"
              )}
            </Button>
            <OAuth/>
          </form>
         
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {/*//! ---------------------- Display an alert if there is an error message -----------------------------*/}

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
