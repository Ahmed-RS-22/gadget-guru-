import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/models.css";

const Saved = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");

  const getAuthToken = () => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo).token : null;
  };

  const fetchComponents = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.get(
        "https://gadetguru.mgheit.com/api/ic/saved",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const ics = response.data.data;
      if (ics.length > 0) {
        setComponents(ics);
        setFilteredComponents(ics);
        setNoDataMessage("");
      } else {
        setComponents([]);
        setFilteredComponents([]);
        setNoDataMessage("There are no saved ICs.");
      }
    } catch (err) {
      setError("Failed to fetch components. Please try again later.");
      console.error("Error fetching components:", err);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredComponents(components);
      return;
    }

    const filtered = components.filter(
      (component) =>
        component.IC_commercial_name.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) || component.IC_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredComponents(filtered);
  };

  const removeComponent = async (ic_id) => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("ic_id", ic_id);

    try {
      await axios.post("https://gadetguru.mgheit.com/api/ic/remove", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const updated = components.filter((component) => component.ID !== ic_id);
      setComponents(updated);
      setFilteredComponents(updated);

      if (updated.length === 0) {
        setNoDataMessage("There are no saved ICs.");
      }
    } catch (err) {
      setError("Failed to remove the component. Please try again.");
      console.error("Error deleting component:", err);
    }
  };

  return (
    <div className="saved">
      <div className="container">
        <div className="head">
          <h2 className="text">saved componenets</h2>
          <input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            className="search-box"
            placeholder="search"
            value={search}
          />
        </div>

        <div className="items">
          {error && <h2>{error}</h2>}
          {noDataMessage && <h2>{noDataMessage}</h2>}

          {filteredComponents.map((component) => (
            <div className="item" key={component.ID}>
              <div className="image">
                <img src={component.IC_image} alt="" />
              </div>
              <div className="text">
                <h3>{component.IC_commercial_name}</h3>
                <p>{component.IC_code}</p>
              </div>
              <button
                className="save-btn"
                onClick={() => removeComponent(component.ID)}
              >
                <i className="fa-solid fa-bookmark"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saved;
