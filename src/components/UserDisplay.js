import React, { useContext, useEffect, useState } from "react";
import UserIcon from "../sources/user.png";
export default function UserDisplay(props) {
  const { alluser, user, handleFollow } = props;

  return (
    <div>
      <div
        className="card d-flex justify-content-center align-items-center my-3 shadow-lg"
        style={{
          borderRadius: "15px",
          width: "22vw",
          backgroundColor: "inherit",
        }}
        key={alluser._id}
      >
        <div className="card-body p-2 ">
          <div className="d-flex  flex-column flex-xxl-row text-black  ">
            <div className="d-flex justify-content-evenly align-items-center">
              <img
                src={alluser.profileImg ? alluser.profileImg : UserIcon}
                alt="Generic placeholder"
                className="img-fluid "
                style={{
                  width: "80%",
                  height: "80%",
                  minWidth: "50px",
                  minHeight: "50px",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div className="d-flex flex-column ms-0 ms-lg-3 mt-3 me-lg-4  justify-content-center justify-content-xxl-start align-items-center align-items-xxl-start ">
              <div className="text-center ">
                <h6 className="mb-1 ">{alluser.user.name}</h6>
                <p
                  className="mb-1 pb-1"
                  style={{
                    color: "#2b2a2a",
                    fontSize: "0.8em",
                  }}
                >
                  {alluser.profession}
                </p>
              </div>
              <div
                className=" rounded-3 py-1 px-2 mb-2"
                style={{ backgroundColor: "#efefef" }}
              >
                <div className="d-flex justify-content-center text-center">
                  <div>
                    <p className="small text-muted mb-1">Post</p>
                    <p className="mb-0">{alluser.noOfPost}</p>
                  </div>
                  <div className="px-3">
                    <p className="small text-muted mb-1">Followers</p>
                    <p className="mb-0">{alluser.follower.length}</p>
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Following</p>
                    <p className="mb-0">{alluser.following.length}</p>
                  </div>
                </div>
                <div className="d-flex pt-1">
                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1 "
                    onClick={() => handleFollow(alluser.userid)}
                  >
                    {alluser.follower.includes(user._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
