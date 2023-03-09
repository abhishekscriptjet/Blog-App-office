import React, { useContext, useEffect, useState } from "react";
import context from "../contextAPI/context";
import UserIcon from "../sources/user.png";

export default function CommentsSection(props) {
  const contexts = useContext(context);
  const { getCommentUserDetailsBe } = contexts;
  const { data, commentUser } = props.cmt;

  const [commentUserDetails, setCommentUserDetails] = useState([]);

  const loadData = async () => {
    const commentUserID = {
      id: commentUser,
    };
    if (props.commentDisplay === "block") {
      setCommentUserDetails(await getCommentUserDetailsBe(commentUserID));
      console.log("ese");
    }
  };

  useEffect(() => {
    loadData();
  }, [props.commentDisplay]);

  return (
    <div>
      <div>
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
          />
          <p className="text-muted ps-2 m-0" style={{ fontSize: "15px" }}>
            {commentUserDetails.length > 0
              ? commentUserDetails[0].user.name
              : ""}
          </p>
        </div>
        <div className="d-flex flex-column me-3">
          {data
            ? data.map((cmt, i) => {
                return (
                  <div className="mb-1 border " key={i}>
                    <p className="text-muted px-3 py-1 ms-5 mb-0 rounded bg-white">
                      {cmt.text}
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
