import React, { useContext, useEffect, useRef, useState } from "react";
import Blogcard from "./Blogcard";
import Bloginput from "./Bloginput";
import context from "../contextAPI/context";
import { useNavigate } from "react-router-dom";
import UserDisplay from "./UserDisplay";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const clickEdit = useRef(null);
  const navigate = useNavigate();

  const contextBlog = useContext(context);
  const {
    setStateUserDetails,
    user,
    alluser,
    loadAllUser,
    userDetails,
    setFollowing,
    getFollowingBlog,
    setClickUserDetails,
    getFollowingFilterBlog,
  } = contextBlog;

  const [editClick, setEditClick] = useState(false);
  const [allusers, setAllusers] = useState(alluser);
  const [userBlog, setUserBlog] = useState([]);
  const [size, setSize] = useState(10);
  const [userSize, setUserSize] = useState(10);
  const [filter, setFilter] = useState("all");

  const saveToServer = async () => {
    setUserBlog(await getFollowingBlog(size));
  };

  const resetEditClick = () => {
    setEditClick(false);
  };

  const loadData = async () => {
    setUserBlog(await getFollowingBlog(size));
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadData();
    } else {
      navigate("./login");
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setAllusers(alluser);
  }, [userBlog]);

  const handleEditClick = (blog) => {
    clickEdit.current.click();
    setEditClick(blog);
  };

  const handleFollow = async (id) => {
    let userid = { id: id };
    setFollowing(userid);
    setUserBlog(await getFollowingBlog(size));
    setUserBlog(await getFollowingBlog(size));

    let allUser = allusers;
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
    const updatedUserDetails = allUser.filter((data) => {
      return data.userid === user._id;
    });
    setStateUserDetails(updatedUserDetails);
    setAllusers(allUser);
  };

  const handleClickOtherUser = async (data) => {
    await setClickUserDetails(data, user);
    navigate("./clickuser");
  };

  const topicFilter = async (topic) => {
    setSize(10);
    const blog = await getFollowingBlog(size);
    if (topic === "sports") {
      setFilter("sports");
      setUserBlog(await getFollowingFilterBlog("sports", size));
    } else if (topic === "science") {
      setFilter("science");
      setUserBlog(await getFollowingFilterBlog("science", size));
    } else if (topic === "teaching") {
      setFilter("teaching");
      setUserBlog(await getFollowingFilterBlog("teaching", size));
    } else if (topic === "all") {
      setFilter("all");
      setUserBlog(blog);
    } else {
      setFilter("all");
      setUserBlog(blog);
    }
  };

  const fetchMore = async () => {
    if (filter === "sports") {
      setUserBlog(await getFollowingFilterBlog("sports", size + 10));
      setSize(size + 10);
    } else if (filter === "science") {
      setUserBlog(await getFollowingFilterBlog("science", size + 10));
      setSize(size + 10);
    } else if (filter === "teaching") {
      setUserBlog(await getFollowingFilterBlog("teaching", size + 10));
      setSize(size + 10);
    } else if (filter === "all") {
      setUserBlog(await getFollowingBlog(size + 10));
      setSize(size + 10);
    } else {
      setUserBlog(await getFollowingBlog(size + 10));
      setSize(size + 10);
    }
  };

  const fetchMoreUsers = async () => {
    setAllusers(await loadAllUser(userSize + 10));
    setUserSize(userSize + 10);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mb-4">
      <div
        className="d-none d-lg-block shadow-lg p-0 me-5"
        style={{
          borderRadius: "10px",
          height: "100vh",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <h4 className="text-center mt-4">Users</h4>
        <div
          id="scrollableDivUser"
          className="px-5 pt-2 pb-5 mt-3"
          style={{ height: "83vh", overflow: "auto", borderRadius: "10px" }}
        >
          <InfiniteScroll
            dataLength={allusers}
            next={fetchMoreUsers}
            hasMore={allusers.length >= userSize}
            loader={<h4 className="text-center">Loading...</h4>}
            scrollableTarget="scrollableDivUser"
          >
            {allusers.length > 0
              ? allusers
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
          </InfiniteScroll>
        </div>
      </div>
      <div
        className="pb-2 shadow-lg"
        style={{
          height: "100vh",
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
        <div
          id="scrollableDiv"
          className="container my-3 px-5"
          style={{ height: "80vh", overflow: "auto", borderRadius: "10px" }}
        >
          <InfiniteScroll
            dataLength={userBlog}
            next={fetchMore}
            hasMore={userBlog.length >= size}
            loader={<h4 className="text-center">Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {userBlog === []
              ? "Please create blog"
              : userBlog.map((blog) => {
                  return (
                    <div
                      key={blog._id}
                      className="mb-4"
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
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
