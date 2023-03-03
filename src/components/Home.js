import React, { useContext, useEffect, useRef, useState } from "react";
import Blogcard from "./Blogcard";
import Bloginput from "./Bloginput";
import context from "../contextAPI/context";
import { useNavigate } from "react-router-dom";
import UserIcon from "../sources/user.png";

export default function Home() {
  const clickEdit = useRef(null);
  const navigate = useNavigate();
  const contextBlog = useContext(context);
  const { loadBlog, userBlog, user, loadUser, setBlogCount, setFollowing } =
    contextBlog;
  const [editClick, setEditClick] = useState(false);
  const [alluser, setAlluser] = useState([]);
  const [clickFollowBtn, setClickFollowBtn] = useState(false);

  const saveToServer = () => {
    loadBlog();
  };

  const resetEditClick = () => {
    setEditClick(false);
  };

  const loadData = async () => {
    setAlluser(await loadUser());
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadBlog();
      loadData();
      setBlogCount();
    } else {
      navigate("./login");
    }
    //eslint-disable-next-line
  }, []);

  const handleEditClick = (blog) => {
    clickEdit.current.click();
    setEditClick(blog);
  };

  const handleFollow = async (id) => {
    let userid = { id: id };
    setFollowing(userid);

    let allUser = alluser;
    for (let index = 0; index < allUser.length; index++) {
      const element = allUser[index];
      if (element.userid === id) {
        const include = element.follower.includes(user._id);
        if (include === true) {
          let follower = element.follower.filter((d) => {
            return d !== user._id;
          });
          let updateduser = {
            ...element,
            follower: [...follower],
          };
          allUser[index] = updateduser;
        } else {
          let updateduser = {
            ...element,
            follower: [...element.follower, user._id],
          };
          allUser[index] = updateduser;
        }
        break;
      }
    }

    for (let index = 0; index < allUser.length; index++) {
      const element = allUser[index];
      if (element.userid === user._id) {
        const include = element.following.includes(id);

        if (include === true) {
          let following = element.following.filter((d) => {
            return d !== id;
          });
          let updateduser = {
            ...element,
            following: [...following],
          };
          allUser[index] = updateduser;
        } else {
          let updateduser = {
            ...element,
            following: [...element.following, id],
          };
          allUser[index] = updateduser;
        }
        break;
      }
    }

    setAlluser(allUser);
  };

  return (
    <div className="d-flex">
      <div
        className="my-5 ms-5 me-5 d-none d-sm-block shadow-lg p-4"
        style={{
          borderRadius: "10px",
        }}
      >
        <h4 className="text-center">Users</h4>
        {alluser.length > 0
          ? alluser
              .filter((users) => {
                return users.userid !== user._id;
              })
              .map((alluser) => {
                return (
                  <div
                    className="card d-flex justify-content-center align-items-center my-3"
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
                            src={
                              alluser.profileImg ? alluser.profileImg : UserIcon
                            }
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
                              style={{ color: "#2b2a2a", fontSize: "0.8em" }}
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
                                <p className="small text-muted mb-1">
                                  Followers
                                </p>
                                <p className="mb-0">
                                  {alluser.follower.length}
                                </p>
                              </div>
                              <div>
                                <p className="small text-muted mb-1">
                                  Following
                                </p>
                                <p className="mb-0">
                                  {alluser.following.length}
                                </p>
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
                );
              })
          : ""}
      </div>
      <div
        className=" flex-grow-1 me-5 pb-2 shadow-lg   "
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          borderRadius: "10px",
        }}
      >
        <div className="text-center">
          {/* <!-- Button trigger modal --> */}
          <button
            ref={clickEdit}
            type="button"
            className="btn btn-primary fw-bold mt-4 py-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Create Your Blog
          </button>
          <hr className="text-white border" />

          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <Bloginput
                    saveToServer={saveToServer}
                    editClick={editClick}
                    resetEditClick={resetEditClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container d-flex flex-wrap flex-xxl-nowrap justify-content-center">
          {userBlog === []
            ? "Please create blog"
            : userBlog.map((blog) => {
                return (
                  <div
                    key={blog._id}
                    className="m-3"
                    // className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6 my-3"
                  >
                    <Blogcard
                      blog={blog}
                      user={user}
                      handleEditClick={handleEditClick}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
