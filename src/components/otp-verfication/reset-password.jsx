import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation
import "../../styles/all.css";
import "../../styles/forms.css";
import logo from "../../assets/images/logo-1.png"
import passchange from "../../assets/images/pass-changed.gif" 
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate(); // Hook to handle navigation
  const location = useLocation();
  const email = location.state?.email || "unknown"; // Extract email from state
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const resetedpassword = () => {
    let resetMessage = document.querySelector("section.pass-changed");
    resetMessage.classList.add("show-message");
    setTimeout(() => resetMessage.classList.remove("show-message"), 4000);
  };
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFeedbackMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://gadetguru.mgheit.com/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            password_confirmation: confirmPassword,
          }),
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.data) {
        setFeedbackMessage("Password reset successfully!");

        resetedpassword();
        setTimeout(() => {
          navigate("/login"); // Redirect to a confirmation page
        }, 6000);
      } else {
        const errorData = await response.json();
        setFeedbackMessage(errorData.message || "Failed to reset password.");
      }
    } catch (error) {
      setFeedbackMessage("Network error. Please try again.");
    }
  };

  return (
    <main className="mainform">
      <section className="pass-changed">
        <div className="message-box">
          <img src={passchange} alt="" />
          <h2 className="title">Password Changed</h2>
        </div>
      </section>
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="my logo" />
        </div>

        {/* Form */}
        <form id="reseted-pass" onSubmit={handlePasswordReset}>
          {/* Header */}
          <h2 className="title">Reset your password</h2>
          <p className="r-message">Please enter your new password.</p>

          {/* Input Fields */}
          <div className="form-inputs">
            {/* Password */}
            <div className="in-div">
              <label htmlFor="resPassword">Password</label>
              <input
                type={passwordVisible.password ? "text" : "password"}
                id="resPassword"
                className="input"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <label htmlFor="rcPassword">Confirm Password</label>
              <input
                type={passwordVisible.confirmPassword ? "text" : "password"}
                id="rcPassword"
                className="input"
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <input type="submit" value="Reset Password" id="resetedSubmit" />

            {/* Feedback Message */}
            <p className="error-message" id="signup-feedback">
              {feedbackMessage}
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
