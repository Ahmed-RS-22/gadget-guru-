import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyError() {
  const location = useLocation();        // ← this is your full location object
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 1) Read the ?message=… param
    const params = new URLSearchParams(location.search);
    const msg = params.get("message") || "An unexpected error has occurred.";
    setMessage(decodeURIComponent(msg));
    console.log("Error message:", msg +"\n" + " params" + params);
    

    // 2) (Optional) scrub the ?message from the URL so it disappears
    //    without causing a page reload
    window.history.replaceState(null, "", location.pathname);
  }, [location.search, location.pathname]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops!</h1>
      <p style={styles.message}>{message}</p>
      <button
        style={styles.button}
        onClick={() => navigate("/home", { replace: true })}
      >
        Go Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#D32F2F",
  },
  message: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    maxWidth: "600px",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1976D2",
    color: "#fff",
    fontWeight: "bold",
  },
};
