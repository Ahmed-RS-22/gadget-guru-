import React, { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import MapPicker from "../components/map";
import {
  User,
  Mail,
  Phone,
  Globe2,
  Languages,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Egypt",
    language: "English",
  });
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : { token: "", isUserLoggedIn: false };
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      return { token: "", isUserLoggedIn: false };
    }
  });
  // Memoize getUserInfo to prevent unnecessary re-renders
  const getUserInfo = useCallback(async () => {
    if (userInfo?.isUserLoggedIn && userInfo?.token) {
      try {
        const response = await axios.get(
          "https://gadetguru.mgheit.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              Accept: "application/json",
            },
          }
        );
        const result = response.data.data;
        setProfile((prevProfile) => {
          const newProfile = {
            ...result,
            country: result.country || "Egypt",
            language: result.language || "English",
            phone: result.phone ?? "", // <--- add this line
          };

          // Only update if the data has actually changed
          if (JSON.stringify(prevProfile) !== JSON.stringify(newProfile)) {
            return newProfile;
          }
          return prevProfile;
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        }
      }
    }
  }, [userInfo?.token, userInfo?.isUserLoggedIn]);

  // Update userInfo when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          const parsedUserInfo = JSON.parse(stored);
          // Only update if the data has actually changed
          if (
            parsedUserInfo.token !== userInfo.token ||
            parsedUserInfo.isUserLoggedIn !== userInfo.isUserLoggedIn
          ) {
            setUserInfo(parsedUserInfo);
          }
        }
      } catch (error) {
        console.error("Error parsing userInfo from storage:", error);
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Check on component mount
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Call getUserInfo when userInfo changes, but with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserInfo();
    }, 100); // Small delay to prevent rapid calls

    return () => clearTimeout(timeoutId);
  }, [getUserInfo]);

  const saveProfileChanges = async () => {
    if (!userInfo?.token) {
      setError("Authentication token missing. Please login again.");
      return;
    }

    const form = new FormData();
    const payLoad = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      username: profile.first_name + " " + profile.last_name,
      phone: profile.phone,
      latitude: profile.latitude,
      longitude: profile.longitude,
    };

    Object.keys(payLoad).forEach((key) => {
      if (payLoad[key] !== undefined && payLoad[key] !== null) {
        form.append(key, payLoad[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://gadetguru.mgheit.com/api/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Profile updated successfully");
      setIsEditMode(false);
      setError("");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };
  const goToForgetPassword = () => {
    navigate("/forget-password", {
      state: { userEmail: profile.email },
    });
  };
  const handleSaveChanges = () => {
    saveProfileChanges();
  };

  // Check if user is logged in
  if (!userInfo?.isUserLoggedIn || !userInfo?.token) {
    return (
      <div className="manin-section">
        <div className="container">
          <div className="content">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>Please login to access your profile</h2>
              <a
                href="/login"
                style={{ color: "#007aff", textDecoration: "none" }}
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="manin-section">
      <div className="container">
        <div className="content">
          <div className="card">
            <div className="header-gradient" />
            <div className="card-body">
              <div className="profile-header">
                <div className="profile-info">
                  <div className="avatar">
                    <User />
                  </div>
                  <div className="user-details">
                    <h2 className="user-name">
                      {profile.first_name + " " + profile.last_name}
                    </h2>
                    <p className="user-email">{profile.email}</p>
                  </div>
                </div>
                <div className="button-group">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="button button-primary"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="button button-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="button button-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={goToForgetPassword}
                        className="button button-outline"
                      >
                        Change Password
                      </button>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ color: "#e34152", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}

              <div className="form-section">
                <h3 className="section-title">Full Name</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      className="form-input"
                      value={profile.first_name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      className="form-input"
                      value={profile.last_name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Contact Information</h3>
                <p className="section-description">
                  Manage your account's contact details for notifications
                </p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        disabled={!isEditMode}
                        className="form-input"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                      <Mail className="input-icon" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        disabled={!isEditMode}
                        className="form-input"
                        maxLength={11}
                        value={profile.phone}
                        placeholder="e.g. +20 1234567890"
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                      <Phone className="input-icon" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Regional Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <div className="input-wrapper">
                      <select
                        disabled={!isEditMode}
                        className="form-select"
                        value={profile.country}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                      >
                        <option value="Egypt">Egypt</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                      <Globe2 className="input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <div className="input-wrapper">
                      <select
                        disabled={!isEditMode}
                        className="form-select"
                        value={profile.language}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                      >
                        <option value="English">English</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                      </select>
                      <Languages className="input-icon" />
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Location</label>
                    <MapPicker
                      lat={profile.latitude}
                      lng={profile.longitude}
                      token={userInfo.token}
                      isEditMode={isEditMode}
                      setLatLng={({ lat, lng }) =>
                        setProfile((prev) => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
