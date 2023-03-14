import React, { useContext, useEffect, useRef, useState } from "react";
import context from "../contextAPI/context";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "../sources/user.png";
import UserDisplay from "./UserDisplay";

export default function Profile() {
  const navigate = useNavigate();
  const clickFollowingRef = useRef(null);
  const contextBlog = useContext(context);
  const {
    user,
    alluser,
    setFollowing,
    getClickUserBlog,
    getClickFollowerBe,
    getClickFollowingBe,
    clickUser,
    setStateAllUsers,
    setStateUserDetails,
  } = contextBlog;
  const [clickUserDetails, setClickUserDetails] = useState({});
  const [clickUserBlog, setClickUserBlog] = useState([]);
  const [follow, setFollow] = useState([]);
  const [modelName, setModelName] = useState();

  // console.log("Click User :", clickUser);

  const loadData = async () => {
    const id = {
      id: clickUser.userid,
    };
    setClickUserDetails(clickUser);
    setClickUserBlog(await getClickUserBlog(id));
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      if (!clickUser.userid) {
        navigate("../");
      }
      loadData();
    } else {
      navigate("../login");
    }
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setFollow([]);
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
    const id = {
      id: clickUser.userid,
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
      return data.userid === clickUserDetails.userid;
    });
    const filterCurrentUser = allUser.filter((data) => {
      return data.userid === user._id;
    });
    setClickUserDetails({ ...filterClickUser[0] });
    setStateAllUsers(allUser);
    setStateUserDetails(filterCurrentUser);
    setFollow(allUser);
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
                        clickUserDetails
                          ? clickUserDetails.profileImg
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
                      onClick={() => handleFollow(clickUserDetails.userid)}
                    >
                      {clickUserDetails.follower
                        ? clickUserDetails.follower.includes(user._id)
                          ? "Following"
                          : "Follow"
                        : ""}
                    </button>
                  </div>
                  <div className="ms-3" style={{ marginTop: "110px" }}>
                    <h5>
                      {clickUserDetails
                        ? `${capitaliz(clickUserDetails.firstName)} ${capitaliz(
                            clickUserDetails.lastName
                          )}`
                        : ""}
                    </h5>
                    <p className="">
                      {clickUserDetails
                        ? `${capitaliz(clickUserDetails.city)}, ${capitaliz(
                            clickUserDetails.state
                          )}, ${capitaliz(clickUserDetails.country)}.`
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
                        {clickUserDetails.follower
                          ? clickUserDetails.follower.length
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
                        {clickUserDetails.following
                          ? clickUserDetails.following.length
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
                        {clickUserDetails ? clickUserDetails.profession : ""}
                      </p>
                      <p className="font-italic mb-1">
                        Lives in{" "}
                        {clickUserDetails
                          ? capitaliz(clickUserDetails.country)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Gender </strong>
                        {clickUserDetails
                          ? capitaliz(clickUserDetails.gender)
                          : ""}
                      </p>
                      <p className="font-italic mb-0">
                        <strong>Birth Date </strong>
                        {clickUserDetails
                          ? capitaliz(clickUserDetails.dateOfBirth)
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
