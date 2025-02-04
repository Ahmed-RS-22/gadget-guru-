import React, { useState, useEffect } from "react";
import "../styles/main.css";

const timeZones = [
  "UTC−12:00",
  "UTC−11:00",
  "UTC−10:00",
  "UTC−09:30",
  "UTC−09:00",
  "UTC−08:00",
  "UTC−07:00",
  "UTC−06:00",
  "UTC−05:00",
  "UTC−04:00",
  "UTC−03:30",
  "UTC−03:00",
  "UTC−02:00",
  "UTC−01:00",
  "UTC±00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+03:30",
  "UTC+04:00",
  "UTC+04:30",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+05:45",
  "UTC+06:00",
  "UTC+06:30",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+08:45",
  "UTC+09:00",
  "UTC+09:30",
  "UTC+10:00",
  "UTC+10:30",
  "UTC+11:00",
  "UTC+12:00",
  "UTC+12:45",
  "UTC+13:00",
  "UTC+14:00",
];

const Profile= () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "Reham",
    lastName: "Hassan",
    gender: "Female",
    language: "English",
    country: "Egypt",
    timeZone: "UTC+2",
    email: "rehamhassan@gmail.com",
  });
  const [emails, setEmails] = useState([{ email: "rehamhassan@gmail.com", addedAt: "1 month ago" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const result = await response.json();
        const countryList = result.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEmail = () => {
    if (newEmail.trim() === "") return;
    setEmails([...emails, { email: newEmail, addedAt: "Just now" }]);
    setNewEmail("");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    console.log("Submitting profile data:", formData, emails);
    try {
      const response = await fetch("https://your-api-endpoint.com/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, emails }),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-form-container">
      <div className="profile-header">
        <div className="profile-picture"></div>
        <div>
          <h2>{`${formData.firstName} ${formData.lastName}`}</h2>
          <p>{formData.email}</p>
        </div>
        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <div className="profile-body">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Time Zone</label>
            <select
              name="timeZone"
              value={formData.timeZone}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              {timeZones.map((timeZone, index) => (
                <option key={index} value={timeZone}>
                  {timeZone}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="email-section">
          <h3>My Email Address</h3>
          {emails.map((email, index) => (
            <div key={index} className="email-item">
              <span>{email.email}</span>
              <small>{email.addedAt}</small>
            </div>
          ))}
          {isEditing && (
            <div className="add-email">
              <input
                type="email"
                placeholder="Add Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button onClick={handleAddEmail}>+ Add Email Address</button>
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="submit-section">
          <button className="submit-button" onClick={handleSubmit}>
            Submit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
