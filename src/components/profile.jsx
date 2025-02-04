import React, { useState, useEffect } from "react";
import axios from "axios";
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
import "../styles/index.css";
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
  const [userInfo, setUserInfo] = useState({
    token: JSON.parse(localStorage.getItem("userInfo"))?.token,
    isUserLoggedIn: JSON.parse(localStorage.getItem("userInfo"))
      ?.isUserLoggedIn,
  });
  const getUserInfo = async () => {
    if (JSON.parse(localStorage.getItem("userInfo")).isUserLoggedIn) {
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
          country: "Egypt",
          language: "English",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveProfileChanges = async () => {
    const form = new FormData();
    const payLoad = {
      // ...profile,
      first_name: profile.first_name,
      last_name: profile.last_name,
      username: profile.first_name + " " + profile.last_name,
    };

    Object.keys(payLoad).forEach((key) => {
      console.log(key, payLoad[key]);

      form.append(key, payLoad[key]);
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
    } catch (error) {
      console.error("Error updating profile:", error);
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
    if (
      passwords.new !== passwords.current &&
      passwords.new === passwords.confirm
    ) {
      setError("");
      return true;
    }
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
        console.log(response.data);
        setIsPasswordMode(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

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
                        {profile.first_name + "" + profile.last_name}
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
                  <span style={{ color: "#e34152" }}>{error}</span>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        className="form-input password-input"
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            current: e.target.value,
                          }))
                        }
                      />
                      <Lock className="input-icon" />
                      <button
                        type="button"
                        onClick={() => handlePasswordVisibility("current")}
                        className="password-toggle"
                      >
                        {showPassword.current ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        className="form-input password-input"
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            new: e.target.value,
                          }))
                        }
                      />
                      <Lock className="input-icon" />
                      <button
                        type="button"
                        onClick={() => handlePasswordVisibility("new")}
                        className="password-toggle"
                      >
                        {showPassword.new ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        className="form-input password-input"
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            confirm: e.target.value,
                          }))
                        }
                      />
                      <Lock className="input-icon" />
                      <button
                        type="button"
                        onClick={() => handlePasswordVisibility("confirm")}
                        className="password-toggle"
                      >
                        {showPassword.confirm ? <EyeOff /> : <Eye />}
                      </button>
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
                          first_name: `${e.target.value}`,
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
                          last_name: `${e.target.value}`,
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
