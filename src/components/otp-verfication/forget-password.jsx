import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "../../styles/all.css";
import "../../styles/forms.css";
import logo from "../../assets/images/logo-1.png"


const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate(); // Hook to handle navigation

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setFeedbackMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("https://gadetguru.mgheit.com/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFeedbackMessage("Instructions have been sent to your email.");

        // Redirect to OTP verification page, passing the email as state
        setTimeout(() => {
          navigate("/otp-verification", { state: { email } });
        }, 5000); // Delay for showing the success message
      } else {
        const errorData = await response.json();
        setFeedbackMessage(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setFeedbackMessage("Failed to connect. Please check your network and try again.");
    }
  };

  return (
    <main className="mainform">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="my logo" />
        </div>

        {/* Form */}
        <form id="Reset-password" onSubmit={handleFormSubmit}>
          {/* Header */}
          <h2 className="title">Forget Password</h2>
          <p className="r-message">
            Enter your email to receive instructions for resetting your password.
          </p>

          {/* Input Fields */}
          <div className="form-inputs">
            {/* Email */}
            <div>
              <label htmlFor="resetEmail">Email</label>
              <input
                type="email"
                id="resetEmail"
                className="input"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <input type="submit" value="Reset password" id="forgetPassword" />

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

export default ForgetPassword;
