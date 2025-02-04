import React, { useRef, useState, useEffect } from "react";
import "../styles/forms.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-1.png"
const Register = ({ onRegister }) => {
  // sending boolean value to header
  const navigate = useNavigate();
  // Refs for form inputs
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // Feedback State
  const [feedback, setFeedback] = useState({ message: "", success: false });

  // Password Visibility State
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [userInfo, setUserInfo] = useState({
    token: "",
    isUserLoggedIn: false,
  });
  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  },[userInfo]);

  // Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate Password with RegExp
  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Validate Input Fields
  const validateInputs = () => {
    const username = nameRef.current.value;
    const email = emailRef.current.value.toLocaleLowerCase();
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!email.includes("@gmail")) {
      setFeedback({ message: "Please enter a valid email.", success: false });
      return false;
    }
    if (username.length < 3) {
      setFeedback({
        message: "Username must be at least 3 characters.",
        success: false,
      });
      return false;
    }
    if (!isValidPassword(password)) {
      setFeedback({
        message:
          "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character.",
        success: false,
      });
      return false;
    }
    if (password !== confirmPassword) {
      setFeedback({ message: "Passwords do not match.", success: false });
      return false;
    }

    setFeedback({ message: "", success: true });
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      const payload = {
        first_name: nameRef.current.value.split(" ")[0],
        last_name: nameRef.current.value.split(" ")[1],
        email: emailRef.current.value,
        password: passwordRef.current.value,
        password_confirmation: confirmPasswordRef.current.value,
      };
      try {
        const response = await fetch(
          "https://gadetguru.mgheit.com/api/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("this email is already taken");
        }
        const result = await response.json();
        console.log(result);
        console.log("Success:", result);
        //  get a uniqe user
        const user = result.data;
        setFeedback({ message: result.message, success: true });

        //  save the user token to local storag
        onRegister();
        setUserInfo({
          token: user.token,
          isUserLoggedIn: true,
        });
        console.log(user);

        // sending user info to header
        setTimeout(() => {
          navigate("/home",{state:{user}});
        }, 4000);
      } catch (error) {
        console.error("Error:", error);
        setFeedback({
          message: error.message || "Registration failed. Please try again.",
          success: false,
        });
      }
    }
  };
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  return (
    <main className="mainform">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="my logo" />
        </div>

        {/* Form */}
        <form id="register" onSubmit={handleSubmit}>
          <h2 className="title">Create an account</h2>

          <div className="form-inputs">
            {/* Feedback */}
            <p
              className={`${
                feedback.success ? "success-message" : "error-message"
              }`}
              id="signup-feedback"
            >
              {feedback.message}
            </p>

            {/* Email */}
            <div>
              <label htmlFor="regEmail">Eamil</label>
              <input
                ref={emailRef}
                type="email"
                id="regEmail"
                className="input"
                placeholder="Enter your email"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="userName">Username</label>
              <input
                ref={nameRef}
                type="text"
                id="userName"
                className="input"
                placeholder="Enter your name"
              />
            </div>

            {/* Password */}
            <div className="in-div">
              <label htmlFor="regPassword">password</label>
              <input
                ref={passwordRef}
                type={passwordVisible.password ? "text" : "password"}
                id="regPassword"
                className="input"
                placeholder="Enter your password"
              />
              <span
                className="showorhide"
                onClick={() => togglePasswordVisibility("password")}
              >
                <i
                  className={`fa-regular ${
                    passwordVisible.password ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>

            {/* Confirm Password */}
            <div className="in-div">
              <label htmlFor="cPassword">confirm password</label>
              <input
                ref={confirmPasswordRef}
                type={passwordVisible.confirmPassword ? "text" : "password"}
                id="cPassword"
                className="input"
                placeholder="confirm your password"
              />
              <span
                className="showorhide"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                <i
                  className={`fa-regular ${
                    passwordVisible.confirmPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>

            {/* Submit Button */}
            <input type="submit" value="Sign Up" id="regSubmit" />

            {/* Terms and Policy */}
            <p className="message">
              By creating an account, you agree to the{" "}
              <Link className="span" to="/tersms-and-conditions">
                Terms of use
              </Link>{" "}
              and <span>Privacy Policy.</span>
            </p>
          </div>
          {/* Redirect to Login */}
          <p className="log-reg">
            Already have an account?{" "}
            <Link to="/login" id="logIn">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
