import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerfiyError() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the error message from URL search params
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message") || "An unexpected error has occurred.";
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message") || "An unexpected error has occurred.";
  
  console.log("Location search:", location.search);
  console.log("Search params:", searchParams.toString());
  console.log("Error message:", message);

  return (
    <div style={styles.container}>
      <div style={styles.errorIcon}>⚠️</div>
      <h1 style={styles.title}>Verification Failed</h1>
      <div style={styles.messageContainer}>
        <p style={styles.message}>{decodeURIComponent(message)}</p>
      </div>
      <p style={styles.subMessage}>
        Please try again or contact support if the problem persists.
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/home")}>
          Go Home
        </button>
        <button style={styles.buttonSecondary} onClick={() => navigate("/login")}>
          Try Login Again
        </button>
      </div>
        Please try again or contact support if the problem persists.
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/home")}>
          Go Home
        </button>
        <button style={styles.buttonSecondary} onClick={() => navigate("/login")}>
          Try Login Again
        </button>
      </div>
    </div>
  );
}

// Enhanced styles for better error display
const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#fef2f2",
    fontFamily: "Poppins, sans-serif",
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    animation: "pulse 2s infinite",
    backgroundColor: "#fef2f2",
    fontFamily: "Poppins, sans-serif",
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    animation: "pulse 2s infinite",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#dc2626",
    fontWeight: "600",
  },
  messageContainer: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
    width: "100%",
    fontWeight: "600",
  },
  messageContainer: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontSize: "1.125rem",
    color: "#991b1b",
    margin: "0",
    lineHeight: "1.6",
    fontWeight: "500",
  },
  subMessage: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem",
    maxWidth: "500px",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  message: {
    fontSize: "1.125rem",
    color: "#991b1b",
    margin: "0",
    lineHeight: "1.6",
    fontWeight: "500",
  },
  subMessage: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem",
    maxWidth: "500px",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
  buttonSecondary: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "2px solid #6b7280",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontWeight: "600",
    transition: "all 0.3s ease",
    minWidth: "120px",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
  buttonSecondary: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "2px solid #6b7280",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontWeight: "600",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
};