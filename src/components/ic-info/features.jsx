import  { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";


const Features = () => {
      const { icInfo } = useOutletContext();
      const feat = icInfo.Ic_details[0];      
      // State for parameters
      const [feats, setFeats] = useState([]);
     
      useEffect(() => {
        if (feat && feat.Features && feat.Features.length > 0) {
            setFeats(feat.Features);
        }
      }, [feat]); // Re-run when icInfo updates
      if (!icInfo || !icInfo.Ic_details || icInfo.Ic_details.length === 0) {
        return <p>Loading...</p>;
      }
      return (
      <>
            <ul className="info-list feat">
                  {
                        feats.map((feat, index) => (
                              <li key={index} className="item">
                                    <span className="feat-name">{feat.feature}</span>
                                    
                              </li>
                  ))}
            </ul>
      </>
            )
}
export default Features;