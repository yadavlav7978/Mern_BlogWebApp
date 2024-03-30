import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

export default function signUp() {
  
  {/*  The 'loading' state variable holds a boolean value indicating whether data is currently being loaded
       'false' indicates that data is not being loaded initially
      'setLoading' is a function that can be called to update the value of 'loading' in the component's state*/}

// Initially, 'loading' is set to 'false' using useState hook
  const [loading,setLoading]=useState(false);

  // Initialize state for display any error
  const [errorMessage,setErrorMessage]=useState(null);

    // Initialize state for form data
  const [formData,setformData]=useState({});

{/*  The 'navigate' function obtained from useNavigate hook can be used to navigate to different routes in your application
    It provides a programmatic way to navigate without directly using <Link> components*/}

  const navigate=useNavigate();

   // Function to handle input changes
  const handleChange=(e)=>{
       // Update the form data with the new value
    setformData({...formData,[e.target.id]:e.target.value});
  };

  //!---------------------------------- Function to Handle Form Submission----------------------------------------------------------

  // Function to handle form submission asynchronously
const handleSubmit = async (e) => {

  e.preventDefault(); // Prevent default form submission behavior

  if(!formData.username || !formData.email || !formData.password){ // Check if any of the required form fields are empty
      // If any required field is empty, set an error message
       return setErrorMessage('Please fill out all fields.');
  }

  try {
    setLoading(true);
    setErrorMessage(null);

      // Send a POST request to the server to sign up the user
      const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'}, // Set request headers
          body: JSON.stringify(formData), // Convert form data to JSON and send in the request body
      });

      const data = await res.json(); // Parse the response data as JSON

      if(data.success===false){
        // If the request was unsuccessful, set the error message based on the response
          return setErrorMessage(data.message);
      }

      setLoading(false);

      if(res.ok){
        // If the response is successful, navigate to the '/signin' route
        navigate('/signin');
      }

  } catch (err) {
      // Handle any errors that occur during the fetch operation
      setErrorMessage(err.message);
      setLoading(false);
  }
}




{/*//!-----------------------------------------------------------------------------------------------------------*/}
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
            You can sign up with your email and password or with Google
          </p>
        </div>


 {/*//!--------------------------- Right-Side div-----------------------------*/}
        <div className="flex-1">

          {/*--------------------------- Right-Side Form------------------------------------*/}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
            <div>
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>

            <div className="">
              <Label value="Your Email" />
              <TextInput type="Email" placeholder="name@gmail.com" id="email" onChange={handleChange}/>
            </div>

            <div className="">
              <Label value="Your Password" />
              <TextInput type="password" placeholder="*********" id="password" onChange={handleChange} />
            </div>
{/*//!--------------- Sign-up Button -----------------------*/}
            <Button gradientDuoTone="purpleToPink" type="submit"
               // Disable the button when loading state is true
             disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size='sm' />
                <span className="pl-3">Loading...</span>
                </>
              ):' Sign Up'
            }
             
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>

{/*//! ---------------------- Display an alert if there is an error message -----------------------------*/}

          {errorMessage && (
            <Alert className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          )}
         
        </div>


      </div>
    </div>
  );
}
