import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/all.css";
import "../../styles/forms.css";
import logo from "../../assets/images/logo-1.png"

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "unknown"; // Get email passed from the previous page

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (value) {
      setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);
      // Focus on the next input
      if (element.nextSibling) element.nextSibling.focus();
    }
  };
  const handleKeyDown = (event, index) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        const updatedOtp = [...otp];
        updatedOtp[index] = ""; // Clear the current input
        setOtp(updatedOtp);
  
        // Move focus to the previous input if backspace is pressed
        if (event.key === "Backspace" && event.target.previousSibling) {
          event.target.previousSibling.focus();
        }
      }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setFeedbackMessage("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch("https://gadetguru.mgheit.com/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await response.json();
      console.log(data.data);
      
      if (data.data ) {
        setFeedbackMessage("OTP verified successfully!");
        setTimeout(() => {
          navigate("/reset-password", { state: { email } }); // Redirect to reset-password page
        }, 1000);
      } else  {
        const errorData = await response.json();
        setFeedbackMessage(errorData.message || "Invalid OTP. Please try again.");
      }
    } catch (error){
      console.log(error);
      
      setFeedbackMessage("Error verifying OTP. Please try again.");
    }
  };

  return (
    <main className="mainform">
      <div className="container">
        <div className="logo">
        <img src={logo} alt="my logo" />
        </div>
        <form onSubmit={handleSubmit} id="otp" className="form-otp">
        <h2 className="title">Check your email</h2>
        <p className="r-message">We sent an OTP to {email} to reset your password.</p>
          <div className="otp-inputs">
            {otp.map((value, index) => (
              <input
                type="text"
                key={index}
                maxLength="1"
                className="otp-input"
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} 

              />
            ))}
          </div>
          <input type="submit" className="otp-submit" value="Verify now"/>
            
          <p className="error-message">{feedbackMessage}</p>
          {/* <p className="otp-resend">
            Didn’t receive the OTP? <button className="resend-btn">Resend OTP</button>
          </p> */}
        </form>
      </div>
    </main>
  );
};

export default OTPVerification;
