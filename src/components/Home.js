import React, { useContext, useEffect, useRef, useState } from "react";
import Blogcard from "./Blogcard";
import Bloginput from "./Bloginput";
import context from "../contextAPI/context";
import { useNavigate } from "react-router-dom";
import UserDisplay from "./UserDisplay";

export default function Home() {
  const clickEdit = useRef(null);
  const navigate = useNavigate();
  const contextBlog = useContext(context);
  const {
    getUser,
    user,
    loadAllUser,
    setFollowing,
    getFollowingBlog,
    setClickUserDetails,
    getUserDetails,
    getFollowingFilterBlog,
  } = contextBlog;
  const [editClick, setEditClick] = useState(false);
  const [alluser, setAlluser] = useState([]);
  const [userBlog, setUserBlog] = useState([]);

  const saveToServer = async () => {
    await loadData();
  };

  const resetEditClick = () => {
    setEditClick(false);
  };

  const loadData = async () => {
    await getUserDetails();
    setAlluser(await loadAllUser());
    setUserBlog(await getFollowingBlog());
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      getUser();
      loadData();
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
    setUserBlog(await getFollowingBlog());
    setUserBlog(await getFollowingBlog());

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

  const handleClickOtherUser = async (data) => {
    await setClickUserDetails(data, user);
    navigate("./clickuser");
  };

  const topicFilter = async (topic) => {
    const blog = await getFollowingBlog();
    if (topic === "sports") {
      setUserBlog(await getFollowingFilterBlog("sports"));
    } else if (topic === "science") {
      setUserBlog(await getFollowingFilterBlog("science"));
    } else if (topic === "teaching") {
      setUserBlog(await getFollowingFilterBlog("teaching"));
    } else if (topic === "all") {
      setUserBlog(blog);
    } else {
      setUserBlog(blog);
    }
  };

  return (
    <div className="d-flex mb-4">
      <div
        className="my-5 ms-5 me-2 d-none d-sm-block shadow-lg p-4"
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
                  <div key={alluser._id}>
                    <UserDisplay
                      alluser={alluser}
                      user={user}
                      handleClickOtherUser={handleClickOtherUser}
                      handleFollow={handleFollow}
                    />
                  </div>
                );
              })
          : ""}
      </div>
      <div
        className="flex-grow-1 mx-sm-5 pb-2 shadow-lg"
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          borderRadius: "10px",
        }}
      >
        <div className="d-flex text-center justify-content-center align-items-center">
          <div className="dropdown mt-4 me-3 py-2">
            <button
              className="btn btn-secondary dropdown-toggle fw-bold"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Topic
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <div
                  className="dropdown-item"
                  value="all"
                  onClick={() => topicFilter("all")}
                >
                  All
                </div>
              </li>
              <li>
                <div
                  className="dropdown-item"
                  value="sports"
                  onClick={() => topicFilter("sports")}
                >
                  Sports
                </div>
              </li>
              <li>
                <div
                  className="dropdown-item"
                  value="science"
                  onClick={() => topicFilter("science")}
                >
                  Science
                </div>
              </li>
              <li>
                <div
                  className="dropdown-item"
                  value="teaching"
                  onClick={() => topicFilter("teaching")}
                >
                  Teaching
                </div>
              </li>
            </ul>
          </div>
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
        <div className="container d-flex flex-wrap flex-xl-row justify-content-center align-items-center ">
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
                      saveToServer={saveToServer}
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
