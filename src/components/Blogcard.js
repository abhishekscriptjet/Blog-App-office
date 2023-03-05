import React, { useState, useContext, useEffect } from "react";
import context from "../contextAPI/context";
import UserIcon from "../sources/user.png";
import CommentsSection from "./CommentsSection";

export default function Blogcard(props) {
  const { topic, description, src, _id, upVote, downVote, userid, comment } =
    props.blog;
  const alertContext = useContext(context);
  const {
    deleteEndPoint,
    setLikebe,
    setDisLikebe,
    getBlogUserDetailsBe,
    setBlogCommentBe,
  } = alertContext;
  const user = props.user;

  const [like, setLike] = useState("regular");
  const [dislike, setDisLike] = useState("fa-heart");
  const [clickLike, setClickLike] = useState(0);
  const [clickDisLike, setClickDisLike] = useState(0);

  const [likeValue, setLikeValue] = useState();
  const [disLikeValue, setDisLikeValue] = useState();
  const [commentsValue, setCommentsValue] = useState([]);

  const [commentText, setcommentText] = useState("");
  const [blogUserDetails, setBlogUserDetails] = useState([]);
  const [commentDisplay, setCommentDisplay] = useState("none");

  const loadData = async () => {
    const blogUserID = {
      id: userid,
    };
    setBlogUserDetails(await getBlogUserDetailsBe(blogUserID));
    setCommentsValue(comment);
  };

  useEffect(() => {
    loadData();
    if (upVote.includes(user._id)) {
      setLikeValue(upVote.length);
      setClickLike(1);
      setLike("solid");
    } else {
      setClickLike(0);
      setLikeValue(upVote.length);
      setLike("regular");
    }
    if (downVote.includes(user._id)) {
      setDisLikeValue(downVote.length);
      setClickDisLike(1);
      setDisLike("fa-heart-crack");
    } else {
      setDisLikeValue(downVote.length);
      setClickDisLike(0);
      setDisLike("fa-heart");
    }
  }, []);

  const handleLike = () => {
    const likeID = { id: _id };
    setLikebe(likeID);
    if (clickLike === 1) {
      setLike("regular");
      setClickLike(0);
      setLikeValue(likeValue - 1);
    } else if (clickLike === 0 && clickDisLike === 0) {
      setLike("solid");
      setDisLike("fa-heart");
      setClickDisLike(0);
      setDisLikeValue(disLikeValue);
      setClickLike(1);
      setLikeValue(likeValue + 1);
    } else {
      setLike("solid");
      setDisLike("fa-heart");
      setClickLike(1);
      setLikeValue(likeValue + 1);
      setClickDisLike(0);
      setDisLikeValue(disLikeValue - 1);
    }
  };

  const handleDisLike = () => {
    const likeID = { id: _id };
    setDisLikebe(likeID);
    if (clickDisLike === 1) {
      setDisLike("fa-heart");
      setClickDisLike(0);
      setDisLikeValue(disLikeValue - 1);
    } else if (clickLike === 0 && clickDisLike === 0) {
      setDisLike("fa-heart-crack");
      setClickDisLike(1);
      setLike("regular");
      setClickLike(0);
      setLikeValue(likeValue);
      setDisLikeValue(disLikeValue + 1);
    } else {
      setDisLike("fa-heart-crack");
      setClickDisLike(1);
      setLike("regular");
      setClickLike(0);
      setLikeValue(likeValue - 1);
      setDisLikeValue(disLikeValue + 1);
    }
  };

  const handleDelete = async () => {
    await deleteEndPoint(_id);
    await props.saveToServer();
  };
  const handleEdit = async () => {
    props.handleEditClick(props.blog);
  };

  const handleOnChangeComment = (e) => {
    const value = e.target.value;
    setcommentText(value);
  };
  const handleClickSendComment = async () => {
    const blogID = {
      id: _id,
      text: commentText,
    };
    setCommentsValue(await setBlogCommentBe(blogID));
  };
  const handleCommentDisplay = () => {
    if (commentDisplay === "none") {
      setCommentDisplay("block");
    } else {
      setCommentDisplay("none");
    }
  };

  return (
    <div
      className="card"
      style={{
        width: "25rem",
        backgroundColor: "inherit",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex justify-content-left align-items-center mx-3 my-1">
        <img
          src={
            blogUserDetails.length > 0
              ? blogUserDetails[0].profileImg
                ? blogUserDetails[0].profileImg
                : UserIcon
              : UserIcon
          }
          className="rounded-circle"
          alt=""
          width="25"
        />
        <p className="text-muted p-2 m-0 ms-2">
          {blogUserDetails.length > 0 ? blogUserDetails[0].user.name : ""}
        </p>
        <div className="drodown ms-auto">
          <i
            className="fa-solid fa-ellipsis p-2 btn "
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={user._id !== userid}
          ></i>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item fw-bold fs-6 text-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item fw-bold fs-6 text-success"
                onClick={handleEdit}
              >
                Edit
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="card-body p-0">
        <img
          src={src}
          className="card-img-top"
          alt="..."
          style={{ width: "inharite", height: "20rem" }}
        />
        <div className="card-body">
          <h5 className="card-title">{topic}</h5>
          <p className="card-text">{description}</p>
        </div>
        <div className="mx-2 d-flex justify-content-left align-items-center ">
          <div className=" p-2">
            <i
              className={`fa-${like} fa-heart text-danger fs-3`}
              onClick={handleLike}
            ></i>
            <label className="fw-bold mx-2 ">{likeValue}</label>
          </div>
          <div className=" mx-2">
            <i
              className={`fa-solid ${dislike} fs-3 text-black`}
              onClick={handleDisLike}
            ></i>
            <label className="fw-bold mx-2">{disLikeValue}</label>
          </div>
        </div>
        <hr className="my-0 mx-3" />
        <div className="mx-2">
          <div className="input-group input-group-sm mb-0 mt-3 mx-2">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Comment
            </span>
            <input
              type="text"
              className="form-control w-25"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              value={commentText}
              onChange={handleOnChangeComment}
            />
            <i
              className="fa-regular fa-paper-plane fs-4 text-muted mx-2 p-2 my-auto"
              onClick={handleClickSendComment}
            ></i>
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <i
              className="fa-solid fa-caret-down pb-2 btn "
              onClick={handleCommentDisplay}
            ></i>
          </div>
        </div>
        {commentsValue.length === 0 ? (
          <div className={`d-${commentDisplay} mb-3`}></div>
        ) : (
          <div className={`d-${commentDisplay} mb-3`}>
            {commentsValue.map((cmt) => {
              return (
                <div key={cmt.commentUser} className=" mt-2">
                  <CommentsSection cmt={cmt} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
