import { useState } from "react";
import context from "./context";

function ContextBlog(props) {
  const [alert, setAlert] = useState(null);
  const [userBlog, setUserBlog] = useState([]);
  const [user, setUser] = useState({});
  const [alluser, setAllUser] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const showAlert = (massage, type) => {
    setAlert({
      msg: massage,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const loadBlog = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/getblog", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      setUserBlog(res.getblog);
      setUser(res.user);
      showAlert(res.msg, "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const loadUser = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/getalluser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const res = await response.json();
    if (res.success) {
      const alluser = res.details;
      setAllUser(res.details);
      showAlert(res.msg, "success");
      return res.details;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const deleteEndPoint = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      `http://localhost:5000/blog/deleteblog/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": user,
        },
      }
    );
    const res = await response.json();
    if (res.success) {
      const deletedBlog = userBlog.filter((blog) => blog._id !== id);
      setUserBlog(deletedBlog);
      showAlert("Blog deleted Successfully.", "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const createBlog = async (blog) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/createblog", {
      method: "POST",
      headers: { "Content-Type": "application/json", "auth-token": user },
      body: JSON.stringify(blog),
    });
    const res = await response.json();
    if (res.success) {
      setUserBlog([...userBlog, res.creatBlog]);
      showAlert("Blog created Successfully.", "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const editBlog = async (blog) => {
    const user = localStorage.getItem("blogToken");
    const id = await blog._id;
    const response = await fetch(`http://localhost:5000/blog/editblog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "auth-token": user },
      body: JSON.stringify(blog),
    });
    const res = await response.json();
    if (res.success) {
      const blogArray = userBlog;
      for (let index = 0; index < blogArray.length; index++) {
        const element = blogArray[index];
        if (element._id === res.getblog._id) {
          blogArray[index] = res.getblog;
          break;
        }
      }
      setUserBlog([...blogArray]);
      showAlert("Blog edited Successfully.", "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const createUserDetails = async (details) => {
    const user = localStorage.getItem("blogToken");

    const response = await fetch(
      "http://localhost:5000/user/createuserdetails",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(details),
      }
    );
    const res = await response.json();
    if (res.success) {
      const { details } = res;
      setUserDetails([details]);
      showAlert(res.msg, "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getUserDetails = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/getuserdetails", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      if (res.details.length === 0) {
        return false;
      }
      setUserDetails([...res.details]);
      showAlert(res.msg, "success");
      return true;
    }
    showAlert(res.error, "danger");
    return false;
  };

  const setBlogCount = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/setblogcount", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
    } else {
      showAlert(res.error, "danger");
    }
  };

  const setFollowing = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/setfollowing", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "auth-token": user },
      body: JSON.stringify(id),
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const setUnfollow = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/setunfollow", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "auth-token": user },
      body: JSON.stringify(id),
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getFollowing = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/getfollowing", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followingDetails;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getFollower = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/user/getfollower", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followerDetails;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const reset = () => {
    setUser({});
    setUserBlog([]);
    setUserDetails([]);
    setAllUser([]);
  };

  return (
    <context.Provider
      value={{
        userBlog,
        alert,
        user,
        alluser,
        userDetails,
        deleteEndPoint,
        createBlog,
        loadBlog,
        showAlert,
        editBlog,
        createUserDetails,
        getUserDetails,
        loadUser,
        reset,
        setBlogCount,
        setFollowing,
        setUnfollow,
        getFollowing,
        getFollower,
      }}
    >
      {props.children}
    </context.Provider>
  );
}

export default ContextBlog;
