import React, { useContext, useEffect, useRef, useState } from "react";
import context from "../contextAPI/context";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "../sources/user.png";
import UserDisplay from "./UserDisplay";
import Blogcard from "./Blogcard";

export default function Profile() {
  const navigate = useNavigate();
  const clickFollowingRef = useRef(null);
  const clickViewImageRef = useRef(null);
  const clickViewImageCloseRef = useRef(null);
  const contextBlog = useContext(context);
  const {
    user,
    alluser,
    setFollowing,
    getClickUserBlog,
    getClickFollowerBe,
    getClickFollowingBe,
    setStateAllUsers,
    setStateUserDetails,
    getClickUserDetails,
    formatTime,
  } = contextBlog;
  const [clickUserDetails, setClickUserDetails] = useState([]);
  const [clickUserBlog, setClickUserBlog] = useState([]);
  const [follow, setFollow] = useState([]);
  const [modelName, setModelName] = useState();
  const [viewBlog, setViewBlog] = useState({});

  const loadData = async () => {
    const clickUserId = localStorage.getItem("clickUserId");
    const id = {
      id: clickUserId,
    };
    setClickUserBlog(await getClickUserBlog(id));
    setClickUserDetails(await getClickUserDetails(clickUserId));
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadData();
    } else {
      navigate("../login");
    }
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setFollow([]);
    setViewBlog({});
  };

  const capitaliz = (string) => {
    if (string) {
      let str = string.charAt(0).toUpperCase() + string.slice(1);
      return str;
    } else {
      return "";
    }
  };

  const handleClickFollow = () => {};

  const handleFollowing = async (e) => {
    const btn = e.target.value;
    const clickUserId = localStorage.getItem("clickUserId");
    const id = {
      id: clickUserId,
    };
    if (btn === "following") {
      setModelName("Following");
      setFollow(await getClickFollowingBe(id));
      clickFollowingRef.current.click();
    } else if (btn === "follower") {
      setModelName("Follower");
      setFollow(await getClickFollowerBe(id));
      clickFollowingRef.current.click();
    }
  };

  const handleClickOtherUser = async (data) => {
    clickViewImageCloseRef.current.click();
  };

  const handleFollow = async (id) => {
    let userid = { id: id };
    setFollowing(userid);

    // let allUser = follow.length > 0 ? follow : [clickUserDetails];
    let allUser = follow.length > 0 ? follow : alluser;
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

    const filterClickUser = alluser.filter((data) => {
      return data.userid === clickUserDetails[0].userid;
    });
    const filterCurrentUser = allUser.filter((data) => {
      return data.userid === user._id;
    });
    setClickUserDetails(filterClickUser);
    setStateAllUsers(allUser);
    setStateUserDetails(filterCurrentUser);
    setFollow(allUser);
  };

  const handleClickBlog = (blog) => {
    setViewBlog(blog);
    clickViewImageRef.current.click();
  };

  return (
    <div>
      {/* FOR FOLLOWER AND FOLLOWING DISPLAY */}
      <button
        ref={clickFollowingRef}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#followModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="followModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {modelName}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <div
                className=""
                style={{
                  borderRadius: "10px",
                }}
              >
                {follow.length > 0
                  ? follow.map((alluser) => {
                      return (
                        <div key={alluser._id}>
                          <UserDisplay
                            alluser={alluser}
                            user={user}
                            handleFollow={handleFollow}
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* FOR VIEW IMAGE */}
      <button
        ref={clickViewImageRef}
        type="button "
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#viewImageModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="viewImageModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content position-relative">
            <div
              className="position-absolute d-flex justify-content-center align-items-center"
              style={{ right: "43%", top: "-26px", zIndex: "1" }}
            >
              <button
                ref={clickViewImageCloseRef}
                type="button"
                className="btn-close bg-danger rounded-circle fs-5 p-3 "
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body px-0 pb-0 pt-0  ">
              {viewBlog._id ? (
                <Blogcard
                  blog={viewBlog}
                  user={user}
                  handleClickOtherUser={handleClickOtherUser}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <section className="h-100 gradient-custom-2 w-100" style={{}}>
        <div className=" py-0 h-100 w-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-12 col-xl-12 m-0 p-0">
              <div className="card border-0">
                <div
                  className="rounded-top text-white d-flex"
                  style={{ backgroundColor: "rgb(60 60 60)", height: "200px" }}
                >
                  <div
                    className="ms-4 ms-sm-5 mt-3  mt-sm-5 d-flex flex-column"
                    style={{ width: "150px" }}
                  >
                    <img
                      src={
                        clickUserDetails.length > 0
                          ? clickUserDetails[0].profileImg
                            ? clickUserDetails[0].profileImg
                            : UserIcon
                          : UserIcon
                      }
                      alt="Generic placeholder"
                      className="img-fluid img-thumbnail mt-2 mt-sm-4 mb-2"
                      style={{
                        width: "150px",
                        minHeight: "150px",
                        height: "150px",
                        zIndex: " 1",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-mdb-ripple-color="dark"
                      style={{ zIndex: "1" }}
                      disabled={
                        clickUserDetails.length > 0
                          ? clickUserDetails[0].userid === user._id
                          : false
                      }
                      onClick={() => handleFollow(clickUserDetails[0].userid)}
                    >
                      {clickUserDetails.length > 0
                        ? clickUserDetails[0].follower.includes(user._id)
                          ? "Following"
                          : "Follow"
                        : ""}
                    </button>
                  </div>
                  <div className="ms-3" style={{ marginTop: "110px" }}>
                    <h5>
                      {clickUserDetails.length > 0
                        ? `${capitaliz(
                            clickUserDetails[0].firstName
                          )} ${capitaliz(clickUserDetails[0].lastName)}`
                        : ""}
                    </h5>
                    <p className="">
                      {clickUserDetails.length > 0
                        ? `${capitaliz(clickUserDetails[0].city)}, ${capitaliz(
                            clickUserDetails[0].state
                          )}, ${capitaliz(clickUserDetails[0].country)}.`
                        : ""}
                    </p>
                  </div>
                </div>
                <div
                  className="p-4 text-black"
                  style={{ backgroundColor: "rgb(229 230 231)" }}
                >
                  <div className="d-flex justify-content-end justify-content-sm-end flex-column flex-sm-row text-center py-0 px-5 ">
                    <div className="text-center  mx-3 mx-sm-4 mx-md-2 mx-lg-5 px-sm-1 px-md-5 px-lg-5 my-1 my-sm-0">
                      <p className="mb-1 h5">
                        {clickUserBlog.length > 0 ? clickUserBlog.length : 0}
                      </p>
                      <p className="small text-muted mb-0 btn curser">Photos</p>
                    </div>
                    <div className="text-center  mx-5 mx-sm-4 mx-md-2 mx-lg-5 px-sm-0 px-md-5 px-lg-5 my-1 my-sm-0">
                      <p className="mb-1 h5">
                        {clickUserDetails.length > 0
                          ? clickUserDetails[0].follower.length
                          : "0"}
                      </p>
                      <button
                        className="small text-muted mb-0 btn"
                        onClick={handleFollowing}
                        value="follower"
                      >
                        Followers
                      </button>
                    </div>
                    <div className="text-center  mx-3 mx-sm-4 mx-md-2 mx-lg-5 px-sm-1 px-md-5 px-lg-5 my-1 my-sm-0">
                      <p className="mb-1 h5">
                        {clickUserDetails.length > 0
                          ? clickUserDetails[0].following.length
                          : "0"}
                      </p>
                      <button
                        className="small text-muted mb-0 btn"
                        onClick={handleFollowing}
                        value="following"
                      >
                        Following
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="card-body p-5 text-black"
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div
                      className="p-4"
                      style={{ backgroundColor: "rgb(229 230 231)" }}
                    >
                      <p className="font-italic mb-1">
                        {clickUserDetails.length > 0
                          ? clickUserDetails[0].profession
                          : ""}
                      </p>
                      <p className="font-italic mb-1">
                        Lives in{" "}
                        {clickUserDetails.length > 0
                          ? capitaliz(clickUserDetails[0].country)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Gender </strong>
                        {clickUserDetails.length > 0
                          ? capitaliz(clickUserDetails[0].gender)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Birth Date </strong>
                        {clickUserDetails.length > 0
                          ? capitaliz(clickUserDetails[0].dateOfBirth)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Since - </strong>
                        {clickUserDetails.length > 0
                          ? formatTime(clickUserDetails[0].user.date)
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0">Recent photos</p>
                    <p className="mb-0">
                      <a href="#!" className="text-muted">
                        {clickUserBlog.length > 0 ? "Show all" : ""}
                      </a>
                    </p>
                  </div>
                  <hr />
                  <div className="row g-2">
                    {clickUserBlog.length > 0 ? (
                      clickUserBlog.map((blog) => {
                        return (
                          <div
                            className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2"
                            key={blog._id}
                          >
                            {blog.src.slice(0, 10) === "data:image" ? (
                              <img
                                src={blog.src}
                                style={{ height: "13rem", cursor: "pointer" }}
                                alt="1"
                                className="w-100 rounded-3"
                                onClick={() => handleClickBlog(blog)}
                              />
                            ) : (
                              <video
                                className="w-100 rounded-3"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleClickBlog(blog)}
                              >
                                <source src={blog.src} type="video/mp4" />
                                Sorry, your browser
                              </video>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="fs-2 text-center text-muted">
                        Create new Blog...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
