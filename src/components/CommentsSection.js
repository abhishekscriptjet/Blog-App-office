import React, { useContext, useEffect, useState } from "react";
import context from "../contextAPI/context";
import UserIcon from "../sources/user.png";

export default function CommentsSection(props) {
  const contexts = useContext(context);
  const { getCommentUserDetailsBe } = contexts;
  const { data, commentUser } = props.cmt;
  const { handleDeleteComment } = props;

  const [commentUserDetails, setCommentUserDetails] = useState([]);

  const loadData = async () => {
    const commentUserID = {
      id: commentUser,
    };
    if (props.commentDisplay === "block") {
      setCommentUserDetails(await getCommentUserDetailsBe(commentUserID));
    }
  };

  useEffect(() => {
    loadData();
  }, [props.commentDisplay]);

  const formatDate = (date) => {
    const newDate = new Date(date);
    const currentTime = newDate.toLocaleTimeString();
    const currentMonth = newDate.getMonth();
    const monthString =
      currentMonth >= 10 ? currentMonth + 1 : `0${currentMonth + 1}`;
    const currentDate = newDate.getDate();
    const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
    return `${newDate.getFullYear()}-${monthString}-${currentDate} | ${currentTime}`;
  };

  // console.log("date ", formatDate(cmt.commentDate));

  return (
    <div>
      <div>
        {data.length > 0 ? (
          <div className="d-flex justify-content-left align-items-center mx-3 my-1">
            <img
              src={
                commentUserDetails.length > 0
                  ? commentUserDetails[0].profileImg
                    ? commentUserDetails[0].profileImg
                    : UserIcon
                  : UserIcon
              }
              className="rounded-circle  border border-secondary"
              alt=""
              width="25"
              style={{
                height: "30px",
                width: "30px",
                maxHeight: "30px",
                maxWidth: "30px",
                objectFit: "cover",
              }}
            />
            <p className="text-muted ps-2 m-0" style={{ fontSize: "15px" }}>
              {commentUserDetails.length > 0
                ? commentUserDetails[0].user.name
                : ""}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="d-flex flex-column me-3">
          {data
            ? data.map((cmt, i) => {
                return (
                  <div className="mb-1 border" key={i}>
                    <p className="d-flex justify-content-between text-muted px-3 py-1 ms-5 mb-0 rounded bg-white ">
                      {cmt.text}
                      <span
                        className="ms-auto text-muted px-0 py-1 ms-5 mb-0 rounded bg-white "
                        style={{ fontSize: "10px" }}
                      >
                        {formatDate(cmt.commentDate)}
                      </span>
                      <i
                        className="fa-regular fa-trash-can ms-2 mt-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteComment(cmt)}
                      ></i>
                    </p>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
