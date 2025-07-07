import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import access_denied from"../assets/access-denied.png"

export default function ProtectedRoute({
  allowed,
  redirectPath = "/home",
  children,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  // If the user is not allowed, redirect them to the login page
  const goHome = () => {
    navigate(redirectPath, {
      replace: true,
      state: { from: location }, // Pass the current
      // path so we can redirect them back after login
    });
  };

  if (!allowed) {
    // You can pass state so after login you can send them back here:
    return (
      <>
        <div className="private">
            <div className="container">
                <div className="left">
                    <img src={access_denied} alt="Access Denied" />
                </div>
                <div className="right">

          <h1>Access Denied</h1>
          <p>You must verfiy your email to view this page.</p>
          <p>Please check your email for the verification link.</p>
          <p>If you didn't receive the email, please check your spam folder </p>
          <p>
            After verifying, you will be redirected to the page you were trying
            to access.
          </p>
          <button className="private-btn" onClick={goHome}>
            {" "}
            go home{" "}
          </button>
                </div>
            </div>
        </div>
      </>
    );
  }

  return children;
}
