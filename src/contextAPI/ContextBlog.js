import { useEffect, useState } from "react";
import context from "./context";

function ContextBlog(props) {
  const [alert, setAlert] = useState(null);
  const [userBlog, setUserBlog] = useState([]);
  const [user, setUser] = useState({});
  const [alluser, setAllUser] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [clickUser, setClickUser] = useState({});
  const [login, setLogin] = useState("");

  const showAlert = (massage, type) => {
    setAlert({
      msg: massage,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const getUser = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/getuser", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      setUser(res.user);
      showAlert(res.msg, "success");
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getUserBlogs = async () => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/getuserblogs", {
      method: "GET",
      headers: { "Content-Type": "application/json", "auth-token": user },
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.blogs;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const loadAllUser = async (size) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      `http://localhost:5000/user/getalluser/${size}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
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
  const loadSearchUser = async (size, query) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      `http://localhost:5000/user/getsearchuser/${size}/${query}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const res = await response.json();
    if (res.success) {
      const alluser = res.details;
      console.log("ress ", alluser);
      // setAllUser(res.details);
      // showAlert(res.msg, "success");
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

  const setLikebe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/setlike", {
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

  const setDisLikebe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/setdislike", {
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

  const getFollowingBlog = async (size) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      `http://localhost:5000/blog/getfollowingblog/${size}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": user },
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followingBlog;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getBlogUserDetailsBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/user/getbloguserdetails",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.details;
    }
    showAlert(res.error, "danger");
  };

  const setBlogCommentBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch("http://localhost:5000/blog/setblogcomment", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "auth-token": user },
      body: JSON.stringify(id),
    });
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.comment;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getCommentUserDetailsBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/user/getbloguserdetails",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.details;
    }
    showAlert(res.error, "danger");
  };

  const setClickUserDetails = (data, user) => {
    if (data._id) {
      setClickUser(data);
      setUser(user);
      showAlert("Getting data", "success");
    } else {
      showAlert("There is same Error to loadding", "danger");
    }
  };

  const getClickUserBlog = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/blog/getclickuserblog",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.ClickUserBlog;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getClickFollowingBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/user/getclickfollowing",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followingDetails;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getClickFollowerBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/user/getclickfollower",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followerDetails;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const getFollowingFilterBlog = async (data, size) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      `http://localhost:5000/blog/getfollowingfilterblog/${size}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify({ topic: data }),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.followingFilterBlog;
    } else {
      showAlert(res.error, "danger");
    }
  };

  const deleteBlogCommentBe = async (id) => {
    const user = localStorage.getItem("blogToken");
    const response = await fetch(
      "http://localhost:5000/blog/deleteblogcomment",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": user },
        body: JSON.stringify(id),
      }
    );
    const res = await response.json();
    if (res.success) {
      showAlert(res.msg, "success");
      return res.comment;
    } else {
      if (res.comment) {
        showAlert(res.error, "danger");
        return res.comment;
      } else {
        showAlert(res.error, "danger");
      }
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = newDate.getMonth();
    // const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
    const currentDate = newDate.getDate();
    const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
    return `${dateString}-${month[currentMonth]}-${newDate.getFullYear()}`;
  };

  const formatTime = (date) => {
    function fromNow(date) {
      const SECOND = 1000;
      const MINUTE = 60 * SECOND;
      const HOUR = 60 * MINUTE;
      const DAY = 24 * HOUR;
      const WEEK = 7 * DAY;
      const MONTH = 30 * DAY;
      const YEAR = 365 * DAY;
      const units = [
        {
          max: 30 * SECOND,
          divisor: 1,
          past1: "just now",
          pastN: "just now",
          future1: "just now",
          futureN: "just now",
        },
        {
          max: MINUTE,
          divisor: SECOND,
          past1: "a second ago",
          pastN: "# seconds ago",
          future1: "in a second",
          futureN: "in # seconds",
        },
        {
          max: HOUR,
          divisor: MINUTE,
          past1: "a minute ago",
          pastN: "# minutes ago",
          future1: "in a minute",
          futureN: "in # minutes",
        },
        {
          max: DAY,
          divisor: HOUR,
          past1: "an hour ago",
          pastN: "# hours ago",
          future1: "in an hour",
          futureN: "in # hours",
        },
        {
          max: WEEK,
          divisor: DAY,
          past1: "yesterday",
          pastN: "# days ago",
          future1: "tomorrow",
          futureN: "in # days",
        },
        {
          max: 4 * WEEK,
          divisor: WEEK,
          past1: "last week",
          pastN: "# weeks ago",
          future1: "in a week",
          futureN: "in # weeks",
        },
        {
          max: YEAR,
          divisor: MONTH,
          past1: "last month",
          pastN: "# months ago",
          future1: "in a month",
          futureN: "in # months",
        },
        {
          max: 100 * YEAR,
          divisor: YEAR,
          past1: "last year",
          pastN: "# years ago",
          future1: "in a year",
          futureN: "in # years",
        },
        {
          max: 1000 * YEAR,
          divisor: 100 * YEAR,
          past1: "last century",
          pastN: "# centuries ago",
          future1: "in a century",
          futureN: "in # centuries",
        },
        {
          max: Infinity,
          divisor: 1000 * YEAR,
          past1: "last millennium",
          pastN: "# millennia ago",
          future1: "in a millennium",
          futureN: "in # millennia",
        },
      ];
      const diff =
        Date.now() -
        (typeof date === "object" ? date : new Date(date)).getTime();
      const diffAbs = Math.abs(diff);
      for (const unit of units) {
        if (diffAbs < unit.max) {
          const isFuture = diff < 0;
          const x = Math.round(Math.abs(diff) / unit.divisor);
          if (x <= 1) return isFuture ? unit.future1 : unit.past1;
          return (isFuture ? unit.futureN : unit.pastN).replace("#", x);
        }
      }
    }
    return `${fromNow(date)}`;
  };

  const reset = () => {
    setUser({});
    setUserBlog([]);
    setUserDetails([]);
    setAllUser([]);
    setLogin("");
  };

  const setLoginFunc = () => {
    setLogin(localStorage.getItem("blogToken"));
  };

  const loadData = async () => {
    await loadAllUser(10);
    await getUser();
    await getUserDetails();
  };

  useEffect(() => {
    if (localStorage.getItem("blogToken")) {
      loadData();
    }
  }, [login]);

  const setStateUserDetails = (data) => {
    setUserDetails(data);
  };
  const setStateAllUsers = (data) => {
    let allUsers = alluser;
    for (let index = 0; index < allUsers.length; index++) {
      const element = allUsers[index];
      if (element.userid === data[0].userid) {
        allUsers[index] = data[0];
        break;
      }
    }
    setAllUser(allUsers);
  };
  const setStateAllUsersByProfileFollow = (data) => {
    setAllUser(data);
  };

  return (
    <context.Provider
      value={{
        userBlog,
        alert,
        user,
        alluser,
        userDetails,
        clickUser,
        loadSearchUser,
        setStateAllUsersByProfileFollow,
        setStateAllUsers,
        setStateUserDetails,
        setLoginFunc,
        loadAllUser,
        formatTime,
        formatDate,
        getUserDetails,
        deleteEndPoint,
        getUserBlogs,
        createBlog,
        showAlert,
        editBlog,
        createUserDetails,
        reset,
        setFollowing,
        getFollowing,
        getFollower,
        setLikebe,
        setDisLikebe,
        getFollowingBlog,
        getBlogUserDetailsBe,
        setBlogCommentBe,
        getCommentUserDetailsBe,
        setClickUserDetails,
        getClickUserBlog,
        getClickFollowerBe,
        getClickFollowingBe,
        getFollowingFilterBlog,
        deleteBlogCommentBe,
      }}
    >
      {props.children}
    </context.Provider>
  );
}

export default ContextBlog;
