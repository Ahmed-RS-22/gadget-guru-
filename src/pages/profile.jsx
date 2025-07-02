import React, { useState, useEffect } from "react";
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

function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "+20",
    country: "Egypt",
    language: "English",
  });

  // Get userInfo from localStorage consistently
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : { token: "", isUserLoggedIn: false };
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      return { token: "", isUserLoggedIn: false };
    }
  });

  const getUserInfo = async () => {
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

        setProfile({
          ...result,
          country: result.country || "Egypt",
          language: result.language || "English",
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
  };

  useEffect(() => {
    getUserInfo();
  }, [userInfo]);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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

  const handleSaveChanges = () => {
    saveProfileChanges();
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validate = () => {
    if (!isValidPassword(passwords.new)) {
      setError(
        "Password must be at least 8 characters long and must contain at least one uppercase letter"
      );
      return false;
    }
    if (passwords.new === passwords.current) {
      setError("Password cannot be the same as the current password");
      return false;
    }
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handlePasswordChange = async () => {
    if (validate()) {
      const formData = new FormData();
      formData.append("email", profile.email);
      formData.append("password", passwords.new);
      formData.append("password_confirmation", passwords.confirm);
      try {
        const response = await axios.post(
          "https://gadetguru.mgheit.com/api/reset-password",
          formData,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        setIsPasswordMode(false);
        setError("");
      } catch (error) {
        console.error("Password change error:", error);
        setError("Failed to change password. Please try again.");
      }
    }
  };

  // Check if user is logged in
  if (!userInfo?.isUserLoggedIn || !userInfo?.token) {
    return (
      <div className="manin-section">
        <div className="container">
          <div className="content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Please login to access your profile</h2>
              <a href="/login" style={{ color: '#007aff', textDecoration: 'none' }}>
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPasswordMode) {
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
                    <button
                      onClick={handlePasswordChange}
                      className="button button-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsPasswordMode(false)}
                      className="button button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="section-title">Change Password</h3>{" "}
                  {error && <span style={{ color: "#e34152" }}>{error}</span>}
                  {["current", "new", "confirm"].map((field) => (
                    <div className="form-group" key={field}>
                      <label className="form-label">
                        {field === "confirm"
                          ? "Confirm New Password"
                          : field === "new"
                          ? "New Password"
                          : "Current Password"}
                      </label>
                      <div className="input-wrapper">
                        <input
                          type={showPassword[field] ? "text" : "password"}
                          className="form-input password-input"
                          onChange={(e) =>
                            setPasswords((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                        />
                        <Lock className="input-icon" />
                        <button
                          type="button"
                          onClick={() => handlePasswordVisibility(field)}
                          className="password-toggle"
                        >
                          {showPassword[field] ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                        onClick={() => setIsPasswordMode(true)}
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
                        value={profile.phone}
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