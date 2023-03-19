import React, { useState, useRef, useContext, useEffect } from "react";
import context from "../contextAPI/context";

export default function Bloginput(props) {
  const editClick = props.editClick;
  const resetEditClick = props.resetEditClick;

  const alertContext = useContext(context);
  const { createBlog, editBlog } = alertContext;

  const closeRef = useRef();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [blog, setBlog] = useState({
    topic: "",
    src: "",
    description: "",
  });

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (value !== "0") {
      setBlog({ ...blog, [name]: value });
    }
  };

  const handleImageOnChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = await convertToBase64(file);
      setBlog({ ...blog, src: src });
    } else {
      setBlog({ ...blog, src: "" });
    }
  };

  const loadImage = async (src) => {
    const canvas = canvasRef.current;
    if (blog.src) {
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = src;
      image.onload = () => {
        canvas.width = 62;
        canvas.height = 38;
        const scale = Math.min(
          canvas.width / image.width,
          canvas.height / image.height
        );
        const x = canvas.width / 2 - (image.width / 2) * scale;
        const y = canvas.height / 2 - (image.height / 2) * scale;
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
      };
    }
  };

  useEffect(() => {
    // loadImage(blog.src);
    //eslint-disable-next-line
  }, [blog.src]);

  useEffect(() => {
    if (editClick) {
      setBlog({
        topic: editClick.topic,
        src: editClick.src,
        description: editClick.description,
      });
    } else {
      resetEditClick();
    }
    //eslint-disable-next-line
  }, [editClick]);

  const handleCrossIcon = async () => {
    await resetEditClick();
    fileInputRef.current.value = "";
    setBlog({ topic: "", description: "", src: "" });
  };

  const handleClear = () => {
    fileInputRef.current.value = "";
    setBlog({ ...blog, src: "" });
  };

  const handleOnSubmit = async () => {
    closeRef.current.click();
    if (blog.description && blog.src && blog.topic) {
      if (editClick) {
        await editBlog({
          ...editClick,
          ...blog,
        });
        await resetEditClick();
        handleCrossIcon();
      } else {
        await createBlog(blog);
        await resetEditClick();
        handleCrossIcon();
      }
      props.saveToServer();
    } else {
      handleCrossIcon();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="modal-header mb-3">
        <h5 className="modal-title" id="exampleModalLabel">
          {editClick ? "Edit Blog" : "Create Blog"}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleCrossIcon}
        ></button>
      </div>

      {/* Input */}
      <div className="col-12 mb-4">
        <select
          className="form-select"
          id="topic"
          name="topic"
          value={blog.topic}
          onChange={handleOnChange}
        >
          <option value="0">Choose Topic...</option>
          <option value="sports">Sports</option>
          <option value="science">Science</option>
          <option value="teaching">Teaching</option>
        </select>
      </div>

      <div className="mb-3 d-flex align-items-center justify-content-center position-relative">
        <input
          ref={fileInputRef}
          className="form-control"
          type="file"
          id="src"
          accept=".jpeg, .png, .jpg, .mp4, .mkv, .mp3,audio/*,video/*,image/*"
          onChange={handleImageOnChange}
        />
        {blog.src.slice(0, 10) === "data:image" && (
          <img
            src={blog.src}
            className="btn btn-outline-dark bg-white p-0 m-0 ms-3 "
            alt="..."
            style={{ width: "14%" }}
          />
        )}
        {blog.src.slice(0, 10) === "data:video" && (
          <video controls loop className="container w-50">
            <source src={blog.src} type="video/mp4" />
            Sorry, your browser
          </video>
        )}
        {blog.src && (
          <button
            type="button"
            className="btn-close position-absolute translate-middle rounded-pill bg-secondary p-2"
            style={{ top: "50%", right: "0%" }}
            aria-label="Close"
            onClick={handleClear}
          ></button>
        )}
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={blog.description}
          onChange={handleOnChange}
          rows="3"
          placeholder="Enter Description..."
        ></textarea>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button
          ref={closeRef}
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          onClick={handleCrossIcon}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOnSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
