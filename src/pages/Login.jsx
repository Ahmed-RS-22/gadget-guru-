import React, { useRef, useState, useEffect } from "react";
import "../styles/forms.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo-1.png";
import SocialButtons from "../components/social";
const Login = ({ onLogin }) => {
  // Refs for form inputs
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  // Feedback state
  const [feedback, setFeedback] = useState({ message: "", success: false });
  const [userInfo, setUserInfo] = useState({
    token: JSON.parse(localStorage.getItem("userInfo"))?.token || "",
    isUserLoggedIn:
      JSON.parse(localStorage.getItem("userInfo"))?.isUserLoggedIn || false,
  });
  // Password Visibility State
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      // API Call (example endpoint)
      const response = await fetch("https://gadetguru.mgheit.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Login failed.");
      }

      const result = await response.json();
      const user = result.data;
      //  save the user token to local storage
      console.log(user);
      
      onLogin(user);
      setUserInfo({
        token: user.token,
        isUserLoggedIn: true,
      });
      
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      setFeedback({ message: "Login successful!", success: true });
    } catch (error) {
      console.error("Error:", error);
      setFeedback({
        message: "Invalid email or password. Please try again.",
        success: false,
      });
    }
  };
  // login usinig social media
  const handleSocialLogin = async (provider) => {
    window.location.href = `https://gadetguru.mgheit.com/api/${provider}/login`;
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
        <form id="logIn" onSubmit={handleSubmit}>
          <h2 className="title">Log in</h2>

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
              <label htmlFor="logEmail">Email</label>
              <input
                ref={emailRef}
                type="email"
                id="logEmail"
                className="input"
                placeholder="Enter your email"
                // required
              />
            </div>

            {/* Password */}
            <div className="in-div">
              <label htmlFor="logPassword">Password</label>
              <input
                ref={passwordRef}
                type={passwordVisible ? "text" : "password"}
                id="logPassword"
                className="input"
                placeholder="Enter your password"
                // required
              />
              <span className="showorhide" onClick={togglePasswordVisibility}>
                <i
                  className={`fa-regular ${
                    passwordVisible ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>

            {/* Submit Button */}
            <input type="submit" value="Log In" id="regSubmit" />
            {/* Terms and Policy */}
            <p className="message">
              By signing in, you agree to the{" "}
              <Link className="span" to="/tersms-and-conditions">
                Terms of use
              </Link>{" "}
              and <span className="span">Privacy Policy.</span>
            </p>
          </div>

          {/* Other Issues */}
          <div className="problems">
            <h4>Other issue with sign in</h4>
            <Link to="/forget-password">Forget your password</Link>
          </div>

          {/* Register Section */}
          <div className="reg">
              <SocialButtons onPress={handleSocialLogin} />
            <fieldset>
              <legend>New to our community</legend>
              <Link to="/register">Create an account</Link>
            </fieldset>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
