import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerfiyError() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the error message from URL search params
  const searchParams = new URLSearchParams(location.search);
  const rawMessage = searchParams.get("message") || "An unexpected error has occurred.";
  
  // Handle double-encoded URLs by decoding twice if needed
  let message = rawMessage;
  try {
    // First decode
    message = decodeURIComponent(rawMessage);
    // Check if it's still encoded (contains %25 patterns)
    if (message.includes('%25')) {
      // Decode again for double-encoded URLs
      message = decodeURIComponent(message);
    }
  } catch (error) {
    console.error("Error decoding message:", error);
    message = rawMessage; // Fallback to raw message
  }
  
  console.log("Location search:", location.search);
  console.log("Raw message:", rawMessage);
  console.log("Decoded message:", message);

  return (
    <div style={styles.container}>
      <div style={styles.errorIcon}>⚠️</div>
      <h1 style={styles.title}>Verification Failed</h1>
      <div style={styles.messageContainer}>
        <p style={styles.message}>{message.replace(/%/g, " ")}</p>
      </div>
      <p style={styles.subMessage}>
        Please try again or contact support if the problem persists.
      </p>
      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onClick={() => navigate("/home")}
          onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
        >
          Go Home
        </button>
        <button 
          style={styles.buttonSecondary} 
          onClick={() => navigate("/login")}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#6b7280";
            e.target.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#6b7280";
          }}
        >
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
    filter: "drop-shadow(0 4px 6px rgba(220, 38, 38, 0.3))",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#dc2626",
    fontWeight: "600",
    textShadow: "0 2px 4px rgba(220, 38, 38, 0.1)",
  },
  messageContainer: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(220, 38, 38, 0.1)",
  },
  message: {
    fontSize: "1.125rem",
    color: "#991b1b",
    margin: "0",
    lineHeight: "1.6",
    fontWeight: "500",
    wordBreak: "break-word",
  },
  subMessage: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem",
    maxWidth: "500px",
    lineHeight: "1.5",
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
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
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