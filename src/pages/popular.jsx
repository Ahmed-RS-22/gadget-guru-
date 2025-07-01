import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/models.css"
const Popular = () => {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
    useEffect(() => {
      const fetchComponents = async () => {
        try {
          const response = await axios.get("https://gadetguru.mgheit.com/api/ic/popular", {
            headers: {
              Accept: "application/json",
            },
          });
          const Ics =response.data.data 
          console.log(Ics);
          
          if(Ics.length > 0){
            setComponents(Ics);
          }else{
            setComponents(["there is no sved ICS"])
          }
        } catch (err) {
          setError("Failed to fetch components. Please try again later.");
          console.error("Error fetching components:", err);
        }
      };
      fetchComponents();
    }, []);
    // seaerch function using api search
    const handleSearch = async (searchTerm) => {
        try {
            const response = await axios.post(`https://gadetguru.mgheit.com/api/ic/search?query=${searchTerm}`, {
                headers: {
                    Accept: "application/json",
                },
                query: searchTerm,
            });
            const Ics = response.data.data;
            if (Ics.length > 0) {
                setComponents(Ics);
            } 
        } catch (err) {
            setError("Failed to fetch search results. Please try again later.");
            console.error("Error fetching search results:", err);
        }
    }

  return (
    <div className="saved">
      <div className="container">
        <div className="head">
          <h2 className="text">Popular ICS</h2>
          <input 
          type="text" 
          className="search-box" 
          placeholder="search"
            onChange={(e) => handleSearch(e.target.value)} 
          />
        </div>
        <div className="items">
            {components.map((component,index) => {
                  if(typeof component == "string"){
                        return (
                              <>
                              <h2>
                                    {component}
                              </h2>
                              </>
                        )
                  }
                  return (
                        <div className="item" key={index}>
                        <div className="image">
                              <img src={component.IC_image} alt="" />
                        </div>
                        <div className="text">
                              <h3>{component.IC_commercial_name} </h3>
                              <p>{component.IC_code}</p>
                        </div>
                  </div>
                  )
            })}
        </div>
      </div>
    </div>
  );
};

export default Popular;
