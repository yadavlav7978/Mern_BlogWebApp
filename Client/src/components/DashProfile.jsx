import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redux/user/userSlice.js";

import { useDispatch } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate, Link } from "react-router-dom";

export default function DashProfile() {
  const [formData, setformData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, error, loading } = useSelector((state) => state.user);

  // State variables to store the selected image file and its URL
  const [imageFile, setImageFile] = useState(null); // Stores the selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // Stores the URL of the selected image

  // State variables to track image upload progress and errors
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Stores the upload progress percentage
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Stores any upload errors
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const filePicker = useRef(); // It is used to create a refernce to the file input element.

  const [showModel, setShowModel] = useState(false);

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
    setImageFileUploading(true);

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
        setImageFileUploading(false);
      },
      () => {
        // On successful upload, get the download URL of the uploaded image
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Update the image file URL state variable with the download URL
          setImageFileUrl(downloadURL);
          setformData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  //!------------------- Function to Handle Update Form Submission --------------------------------------

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for Image uploading......");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  //!---------------------- handleDeleteUser function--------------------

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate("/signin");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  //!------------handleSignOut function------------------

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/signin");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500  dark:text-gray-200">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes , I'm sure
              </Button>
              <Button onClick={() => setShowModel(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
