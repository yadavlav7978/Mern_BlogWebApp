import { Alert, Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  // State variables to store the selected image file and its URL
  const [imageFile, setImageFile] = useState(null); // Stores the selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // Stores the URL of the selected image

  // State variables to track image upload progress and errors
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Stores the upload progress percentage
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Stores any upload errors

  const filePicker = useRef(); // It is used to create a refernce to the file input element.

  // Function to handle changes in the selected image
  const handleImageChange = (e) => {
    // Retrieve the selected file from the input event
    const file = e.target.files[0];

    // Check if a file is selected
    if (file) {
      // Set the selected image file in state
      setImageFile(file);

      // Generate a URL for the selected file and set it in state
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // useEffect hook to upload the imageFile to the database
  useEffect(() => {
    //if an imageFile is present call the uploadImage function
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //!--------- Function to upload the image to Firebase Storage----------------
  const uploadImage = async () => {
    // Reset any previous upload errors
    setImageFileUploadError(null);

    // Get a reference to the Firebase Storage instance
    const storage = getStorage(app);

    // Generate a unique file name for the image based on the current timestamp
    const fileName = new Date().getTime() + imageFile.name;

    // Create a reference to the storage location where the image will be uploaded
    const storageRef = ref(storage, fileName);

    // Upload the image file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Set up event listeners to track upload progress and handle errors
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate the upload progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Update the upload progress state variable

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // Handle upload errors
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        // Reset state variables related to the image upload
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        // On successful upload, get the download URL of the uploaded image
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Update the image file URL state variable with the download URL
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePicker} // Add the ref with the file input element
          hidden
        />
        {/*This line creates an input element that allows users to select files */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer"
          onClick={() => filePicker.current.click()} // When clicked, it triggers a click event on the file input element (filePicker.current.click()), allowing the user to select a file.
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture} // If the image file url exist then show it, else show the profile picture
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
