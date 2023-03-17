import React, { useState, useContext, useEffect } from "react";
import loginBg from "../sources/signinBg.jpg";
import icon from "../sources/icon.png";
import { useNavigate } from "react-router-dom";
import context from "../contextAPI/context";

export default function Signup() {
  const alertContext = useContext(context);
  const { showAlert } = alertContext;

  const [isSubmit, setIsSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setUser({ ...user, [name]: value });
  };

  const validate = (value) => {
    const errors = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regexUsername = /^([A-z][0-9])*[^\s]*$/;
    const passwordCapi = /[A-Z]/g;
    const passwordSml = /[a-z]/g;
    const passwordNum = /[0-9]/g;

    if (!value.password) {
      errors.password = "*Password is required. ";
    } else if (!passwordCapi.test(value.password)) {
      errors.password = "*Password must have One Capital letter!";
      setIsSubmit(false);
    } else if (!passwordSml.test(value.password)) {
      errors.password = "*Password must have One small letter!";
      setIsSubmit(false);
    } else if (!passwordNum.test(value.password)) {
      errors.password = "*Password must have One Number!";
      setIsSubmit(false);
    } else if (value.password.length < 8) {
      errors.password = "*Password must have One 8 charactors!";
      setIsSubmit(false);
    }
    if (!value.email) {
      errors.email = "*Email is required. ";
      setIsSubmit(false);
    } else if (!regexEmail.test(value.email)) {
      errors.email = "*This is not a valid email format!";
      setIsSubmit(false);
    }
    if (!value.name) {
      errors.name = "*Username is required. ";
      setIsSubmit(false);
    } else if (value.name.length < 3) {
      errors.name = "*Username should not less than 3 charactors.";
      setIsSubmit(false);
    } else if (!regexUsername.test(value.name)) {
      errors.name = "*Username should not have any spaces.";
      setIsSubmit(false);
    }
    if (!value.phone) {
      errors.phone = "*Contact number is required. ";
      setIsSubmit(false);
    } else if (value.phone.length < 10) {
      errors.phone = "*Contact number should not less than 10 charactors.";
      setIsSubmit(false);
    } else if (value.phone.length > 10) {
      errors.phone = "*Contact number should not greter than 10 charactors.";
      setIsSubmit(false);
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }

    return errors;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (isSubmit) {
      const networkOrigin = "http://192.168.43.146:5000";
      const localOrigin = "http://localhost:5000";
      // const response = await fetch("http://localhost:5000/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(user),
      // });
      const response = await fetch(
        `${networkOrigin || localOrigin}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const json = await response.json();
      if (!json.success) {
        if (json.error) {
          showAlert(json.error, "danger");
        } else {
          showAlert("Invelid credentials", "danger");
        }
      } else {
        showAlert("Account created Successfully.", "success");
        navigate("/login");
      }
      setIsSubmit(false);
    } else {
      showAlert("Please fill valid details", "danger");
    }
  };

  useEffect(() => {
    setFormError(validate(user));
  }, [user]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <img
        className="p-0 m-0"
        src={loginBg}
        style={{
          width: "100%",
          height: "800px",
          position: "relative",
          filter: "brightness(0.5)",
        }}
        height="800"
        alt="bg"
      ></img>
      <div
        className=" text-center position-absolute"
        style={{
          width: "250px",
        }}
      >
        <div className="form-signin d-flex justify-content-center align-items-center ">
          <form className="w-100">
            <img className="mb-4" src={icon} alt="" width="80" />
            <h1 className="h3 mb-3 text-white fw-normal">Please sign up</h1>

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={user.name}
                onChange={handleOnChange}
                placeholder="Username"
              />
              <div className="feedback text-danger fst-italic">
                {formError.name}
              </div>
              <label htmlFor="name">Username</label>
            </div>

            <div className="form-floating">
              <input
                type="phone"
                className="form-control"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleOnChange}
                placeholder="Phone Number"
              />
              <div className="feedback text-danger fst-italic">
                {formError.phone}
              </div>
              <label htmlFor="phone">Phone Number</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                onChange={handleOnChange}
                placeholder="name@example.com"
              />
              <div className="feedback text-danger fst-italic">
                {formError.email}
              </div>
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={user.password}
                onChange={handleOnChange}
                placeholder="Password"
              />
              <div className="feedback text-danger fst-italic">
                {formError.password}
              </div>
              <label htmlFor="password">Password</label>
            </div>

            <div className="checkbox text-white mb-3 my-1">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button
              className="w-100 btn btn-lg btn-primary"
              type="submit"
              onClick={handleOnSubmit}
            >
              Sign up
            </button>
            <p className="mt-4 mb-3 text-white">© 2023</p>
          </form>
        </div>
      </div>
    </div>
  );
}
