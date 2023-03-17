import React, { useContext, useEffect, useState } from "react";
import context from "../contextAPI/context";
import UserIcon from "../sources/user.png";

export default function CommentsSection(props) {
  const contexts = useContext(context);
  const { getCommentUserDetailsBe, formatTime } = contexts;
  const { data, commentUser, userDetails } = props.cmt;
  const { handleDeleteComment, user } = props;

  const [commentUserDetails, setCommentUserDetails] = useState([]);

  const loadData = async () => {
    // const commentUserID = {
    //   id: commentUser,
    // };
    // setCommentUserDetails(await getCommentUserDetailsBe(commentUserID));
    setCommentUserDetails([userDetails]);
  };

  useEffect(() => {
    loadData();
  }, [props.commentDisplay]);

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
                    <div className="d-flex justify-content-between align-items-center text-muted ps-3 pe-2 py-1 ms-5 mb-0 rounded bg-white ">
                      {cmt.text}
                      <div className="ms-auto text-end">
                        <div
                          className=" text-muted px-0 py-0 mb-0 rounded bg-white"
                          style={{ fontSize: "10px" }}
                        >
                          {
                            // `${formatDate(cmt.commentDate)}`
                          }
                        </div>
                        <div
                          className="text-muted px-0 py-0 mb-0 rounded bg-white "
                          style={{ fontSize: "10px" }}
                        >
                          {`${formatTime(cmt.commentDate)}`}
                        </div>
                      </div>
                      <i
                        className={`fa-regular fa-trash-can ms-2 ${
                          commentUser === user._id ? "d-block" : "d-none"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteComment(cmt)}
                      ></i>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
