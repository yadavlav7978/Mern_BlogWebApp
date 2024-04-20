import { TextInput, Select, FileInput, Button } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
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
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}
