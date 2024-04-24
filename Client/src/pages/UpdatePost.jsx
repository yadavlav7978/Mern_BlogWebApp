import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  // State variables for managing file, upload progress, upload error, and form data
  const [file, setFile] = useState(null); // Selected file
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Progress of image upload
  const [imageUploadError, setImageUploadError] = useState(null); // Error message during image upload
  const [formData, setFormData] = useState({}); // Form data including the uploaded image URL
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {}
  }, [postId]);

  // Function to handle image upload
  const handleUploadImage = async () => {
    try {
      // Check if a file is selected
      if (!file) {
        setImageUploadError("Please select an Image");
        return;
      }

      // Reset any previous error message
      setImageUploadError(null);

      // Get reference to Firebase storage and generate a unique file name
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      // Upload the file to Firebase storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Event listener to track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        // Handle upload error
        (error) => {
          console.log(error);
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        // Handle upload success
        () => {
          // Get the download URL of the uploaded image
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Reset progress and error message
            setImageUploadProgress(null);
            setImageUploadError(null);
            // Update form data with the image URL
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      // Handle any unexpected errors during image upload
      console.log(error);
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("something went wrong.");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData && formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData && formData.category}
          >
            <option value="uncategorised">Select a category</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Javascript">Javascript</option>
            <option value="React.Js">React.Js</option>
            <option value="Node.Js">Node.Js</option>
            <option value="Express.Js">Express.Js</option>
            <option value="MongoDB">MongoDB</option>
            <option value="Sql">Sql</option>
          </Select>
        </div>
        <div className="flex gap items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 ">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData && formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData && formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
