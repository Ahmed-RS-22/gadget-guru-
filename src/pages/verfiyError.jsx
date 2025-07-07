import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerfiyError() {
  const location = useLocation();
  const navigate = useNavigate();

  // If you’re passing the error on as a query param, e.g. ?message=Something+went+wrong
  const params = new URLSearchParams(location);
  const message = params.get("message") || "An unexpected error has occurred.";
  console.log( "Error message:", message);
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops!</h1>
      <p style={styles.message}>{decodeURIComponent(message)}</p>

      <button style={styles.button} onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}

// Optional: inline styles, or replace with your CSS/module
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
  },
};
