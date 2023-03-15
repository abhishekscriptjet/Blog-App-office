import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icon from "../sources/navicon.png";
import context from "../contextAPI/context";
import UserDisplay from "./UserDisplay";
import InfiniteScroll from "react-infinite-scroll-component";
import loading from "../sources/loading.gif";

export default function Navebar(props) {
  const alertContext = useContext(context);
  const {
    user,
    reset,
    showAlert,
    setFollowing,
    loadSearchUser,
    setStateUserDetails,
    setStateAllUsersByNavSearch,
  } = alertContext;

  const navigate = useNavigate();
  let location = useLocation();

  const [alluser, setAlluser] = useState([]);
  const [size, setSize] = useState(2);
  const [query, setQuery] = useState("");

  const handleLogout = (e) => {
    localStorage.removeItem("blogToken");
    reset();
    showAlert("Logout Successfully.", "success");
    navigate("/login");
  };

  const loadData = async () => {};

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadData();
    } else {
      navigate("./login");
    }
    //eslint-disable-next-line
  }, []);

  const handleSearchOnChange = async (e) => {
    let queryValue = e.target.value;
    queryValue = queryValue.replace(/^\s+/gm, "");
    setQuery(queryValue);
    if (query && queryValue) {
      setAlluser(await loadSearchUser(size, query));
    } else {
      setAlluser([]);
      setSize(2);
    }
  };

  const fetchMore = async () => {
    if (query) {
      setAlluser(await loadSearchUser(size + 2, query));
      setSize(size + 10);
    } else {
      setAlluser([]);
    }
  };

  const handleClickOtherUser = async (data) => {
    localStorage.setItem("clickUserId", data.userid);
    navigate("./clickuser");
  };

  const handleFollow = async (id) => {
    let userid = { id: id };
    setFollowing(userid);
    // setUserBlog(await getFollowingBlog(size));
    // setUserBlog(await getFollowingBlog(size));

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
    const updatedUserDetails = allUser.filter((data) => {
      return data.userid === user._id;
    });
    const details = allUser.filter((data) => {
      return data.userid === id;
    });
    setStateAllUsersByNavSearch(details[0]);
    setStateUserDetails(updatedUserDetails);
    setAlluser(allUser);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            to={localStorage.getItem("blogToken") ? "/" : "/login"}
          >
            <img src={icon} className="mx-3" alt="icon" width="40" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to={localStorage.getItem("blogToken") ? "/" : "/login"}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  to={
                    localStorage.getItem("blogToken") ? "/profile " : "/login"
                  }
                >
                  Profile
                </Link>
              </li>
            </ul>
            <form className="d-flex dropdown">
              <input
                className="form-control me-2 py-1 dropdown-toggle"
                placeholder="Search"
                id="dropdownMenu2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  width: "30vw",
                }}
                onChange={handleSearchOnChange}
              />

              <div
                className="dropdown-menu text-center"
                aria-labelledby="dropdownMenu2"
                style={{
                  width: "100%",
                  height: "50vh",
                  borderRadius: "10px",
                }}
              >
                <div
                  id="scrollableDivSearch"
                  className="d-flex align-items-center flex-column  "
                  style={{
                    overflow: "auto",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                  }}
                >
                  <InfiniteScroll
                    dataLength={alluser}
                    next={fetchMore}
                    hasMore={alluser.length >= size}
                    loader={
                      <div className="text-center">
                        <img
                          className="my-4"
                          src={loading}
                          alt="Loading"
                          style={{ width: "30px", maxWidth: "30px" }}
                        />
                      </div>
                    }
                    scrollableTarget="scrollableDivSearch"
                  >
                    {alluser.length > 0
                      ? alluser.map((alluser) => {
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
            </form>

            {!localStorage.getItem("blogToken") ? (
              <div className="mx-4 my-1 py-1 border-start">
                <div className="mx-3">
                  <Link className="btn btn-primary mx-2 py-1" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-primary mx-0 py-1" to="/signup">
                    Signup
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mx-4 my-1 border-start py-1 ">
                <Link
                  className="btn btn-danger mx-4 "
                  to="/login"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
