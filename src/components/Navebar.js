import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icon from "../sources/navicon.png";
import context from "../contextAPI/context";
import UserDisplay from "./UserDisplay";

export default function Navebar() {
  const alertContext = useContext(context);
  const { showAlert, reset, loadAllUser, user } = alertContext;

  const navigate = useNavigate();
  let location = useLocation();

  const [query, setQuery] = useState("");
  const [alluser, setAlluser] = useState([]);

  const handleLogout = (e) => {
    localStorage.removeItem("blogToken");
    reset();
    showAlert("Logout Successfully.", "success");
    navigate("/login");
  };
  const loadData = async () => {
    setAlluser(await loadAllUser());
  };
  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadData();
    } else {
      navigate("./login");
    }
    //eslint-disable-next-line
  }, []);

  console.log("search ", query);

  const handleSearchOnChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSearchClick = () => {};
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
                onClick={handleSearchClick}
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
                  className="d-flex align-items-center flex-column  "
                  style={{
                    overflow: "auto",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                  }}
                >
                  {alluser.length > 0
                    ? alluser
                        .filter((users) => {
                          return (
                            users.firstName === query ||
                            users.lastName === query ||
                            users.user.name === query
                          );
                        })
                        .map((alluser) => {
                          return (
                            <div key={alluser._id}>
                              <UserDisplay
                                alluser={alluser}
                                user={user}
                                // handleClickOtherUser={handleClickOtherUser}
                                // handleFollow={handleFollow}
                              />
                            </div>
                          );
                        })
                    : ""}
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
