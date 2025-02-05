import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

const Params = () => {
  const { icInfo } = useOutletContext();
  
  // Ensure icInfo is loaded before accessing properties
  
  const parameter = icInfo.Ic_details[0];
  
  // State for parameters
  const [parameters, setParameters] = useState({});
  
  useEffect(() => {
        if (parameter && parameter.Parameters && parameter.Parameters.length > 0) {
              setParameters(parameter.Parameters[0]); 
            }
      }, [parameter]); // Re-run when icInfo updates
      if (!icInfo || !icInfo.Ic_details || icInfo.Ic_details.length === 0) {
        return <p>Loading...</p>;
      }

  // Getting keys and values dynamically
  const keys = Object.keys(parameters);
  const values = Object.values(parameters);

  return (
    <>
      <ul className="info-list">
        {keys.map((key, index) => (
          <li key={index} className="item">
            <span className="info-key">{key.replace(/_/g, " ")}</span>
            <span className="info-value">{values[index]}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Params;
