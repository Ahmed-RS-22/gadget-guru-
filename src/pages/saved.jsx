import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/models.css"
const Saved = () => {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  // Function to get token from localStorage
    const getAuthToken = () => JSON.parse(localStorage.getItem("userInfo")).token;    
  //   // Fetch saved components from API
    useEffect(() => {
      const fetchComponents = async () => {
        const token = getAuthToken();        
        if (!token) {
          setError("Authentication token is missing.");
          return;
        }

        try {
          const response = await axios.get("https://gadetguru.mgheit.com/api/ic/saved", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const Ics =response.data.data 
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

  //   // Function to remove a component
    const removeComponent = async (ic_id) => {      
      const token = getAuthToken();      
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }
      const formData = new FormData();
      formData.append("ic_id", ic_id);

      try {
        await axios.post("https://gadetguru.mgheit.com/api/ic/remove",
          formData,
         {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
 // Send ic_id in request body
        });        
        setComponents((prev) => prev.filter((component) => component.ID !== ic_id)); // Update state
      } catch (err) {
        setError("Failed to remove the component. Please try again.");
        console.error("Error deleting component:", err);
      }
    };    
  // Filter components based on search
  return (
    <div className="saved">
      <div className="container">
        <div className="head">
          <h2 className="text">saved componenets</h2>
          <input 
          type="text" 
          className="search-box" 
          placeholder="search" />
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
                        <button className="save-btn" onClick={()=>removeComponent(component.ID)}>
                        <i
                        class={`fa-solid fa-bookmark`}
                      ></i>
                        </button>
                  </div>
                  )
            })}
        </div>
      </div>
    </div>
  );
};

export default Saved;
