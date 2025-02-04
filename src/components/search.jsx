import react, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const handleInputChange = async (e) => {
    const userInput = e.target.value;
    setQuery(userInput);    
    if (userInput.length > 1) {
      try {
        const response = await fetch(
          `https://gadetguru.mgheit.com/api/ic/search?query=${userInput}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            query:userInput,
          }
        );
        const result = await response.json();
        // Check if API returned data
        if (result.data && result.data.length > 0) {
          setSuggestions(result.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.log("Error fetching IC suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };
  const handleSearch = (ic) => {
    if (ic) {
      navigate(`/ic-info/${ic.Slug}`, { state: { id:ic.ID } }); // Pass full IC object
    } else {
      alert("Please select a product or enter a valid query!");
    }
  };

  return (
    <div className="search">
      <ul className={`suggetions ${suggestions.length > 0 ?"show" :""}`}>
        {suggestions.map((ic) => (
          <li key={ic.ID} onClick={() => handleSearch(ic)}>
            {ic.IC_commercial_name} ({ic.IC_code})
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Search by IC number or name"
        className="search-input"
        value={query}
        onChange={handleInputChange}
      />
      <button
        className="search-btn"
        onClick={() => suggestions.length && handleSearch(suggestions[0])}
      >
        Search
      </button>
    </div>
  );
};
export default Search;
