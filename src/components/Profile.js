import React, { useContext, useEffect, useRef } from "react";
import context from "../contextAPI/context";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "../sources/user.png";

export default function Profile() {
  const navigate = useNavigate();
  const clickFollowingRef = useRef(null);
  const contextBlog = useContext(context);
  const {
    loadBlog,
    userBlog,
    user,
    getUserDetails,
    userDetails,
    alluser,
    loadUser,
  } = contextBlog;

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadBlog();
      loadUser();
      getUserDetails();
    } else {
      navigate("./login");
    }
    //eslint-disable-next-line
  }, []);

  const capitaliz = (string) => {
    let str = string.charAt(0).toUpperCase() + string.slice(1);
    return str;
  };

  const handleEditProfile = () => {
    navigate("../userdetails");
  };
  const handleFollowing = () => {
    clickFollowingRef.current.click();
  };

  return (
    <div>
      <button
        ref={clickFollowingRef}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Following
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <div
                className=""
                style={{
                  borderRadius: "10px",
                }}
              >
                {alluser.length > 0
                  ? alluser
                      .filter((users) => {
                        return users.userid !== user._id;
                      })
                      .map((alluser) => {
                        return (
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
                                    src={
                                      alluser.profileImg
                                        ? alluser.profileImg
                                        : UserIcon
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
                                    <h6 className="mb-1 ">
                                      {alluser.user.name}
                                    </h6>
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
                                        <p className="small text-muted mb-1">
                                          Post
                                        </p>
                                        <p className="mb-0">
                                          {alluser.noOfPost}
                                        </p>
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
                                        onClick={() =>
                                          handleFollow(alluser.userid)
                                        }
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="h-100 gradient-custom-2 w-100" style={{}}>
        <div className=" py-0 h-100 w-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-12 col-xl-12">
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
                        userDetails.length > 0
                          ? userDetails[0].profileImg
                          : UserIcon
                      }
                      alt="Generic placeholder"
                      className="img-fluid img-thumbnail mt-2 mt-sm-4 mb-2"
                      style={{
                        width: "150px",
                        minHeight: "150px",
                        height: "150px",
                        zIndex: " 1",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary  btn-outline-light"
                      data-mdb-ripple-color="dark"
                      style={{ zIndex: "1" }}
                      onClick={handleEditProfile}
                    >
                      Edit profile
                    </button>
                  </div>
                  <div className="ms-3" style={{ marginTop: "110px" }}>
                    <h5>
                      {userDetails.length > 0
                        ? `${capitaliz(userDetails[0].firstName)} ${capitaliz(
                            userDetails[0].lastName
                          )}`
                        : ""}
                    </h5>
                    <p className="">
                      {userDetails.length > 0
                        ? `${capitaliz(userDetails[0].city)}, ${capitaliz(
                            userDetails[0].state
                          )}, ${capitaliz(userDetails[0].country)}.`
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
                        {userBlog.length > 0 ? userBlog.length : 0}
                      </p>
                      <p className="small text-muted mb-0">Photos</p>
                    </div>
                    <div className="text-center  mx-5 mx-sm-4 mx-md-2 mx-lg-5 px-sm-0 px-md-5 px-lg-5 my-1 my-sm-0">
                      <p className="mb-1 h5">
                        {userDetails.length > 0
                          ? userDetails[0].follower.length
                          : "0"}
                      </p>
                      <p className="small text-muted mb-0">Followers</p>
                    </div>
                    <div className="text-center  mx-3 mx-sm-4 mx-md-2 mx-lg-5 px-sm-1 px-md-5 px-lg-5 my-1 my-sm-0">
                      <p className="mb-1 h5">
                        {userDetails.length > 0
                          ? userDetails[0].following.length
                          : "0"}
                      </p>
                      <button
                        className="small text-muted mb-0"
                        onClick={handleFollowing}
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
                        {userDetails.length > 0
                          ? userDetails[0].profession
                          : ""}
                      </p>
                      <p className="font-italic mb-1">
                        Lives in{" "}
                        {userDetails.length > 0
                          ? capitaliz(userDetails[0].country)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Gender </strong>
                        {userDetails.length > 0
                          ? capitaliz(userDetails[0].gender)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Birth Date </strong>
                        {userDetails.length > 0
                          ? capitaliz(userDetails[0].dateOfBirth)
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0">Recent photos</p>
                    <p className="mb-0">
                      <a href="#!" className="text-muted">
                        {userBlog.length > 0 ? "Show all" : ""}
                      </a>
                    </p>
                  </div>
                  <hr />
                  <div className="row g-2">
                    {userBlog.length > 0 ? (
                      userBlog.map((blog) => {
                        return (
                          <div
                            className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2"
                            key={blog._id}
                          >
                            <img
                              src={blog.src}
                              style={{ height: "13rem" }}
                              alt="1"
                              className="w-100 rounded-3"
                            />
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
