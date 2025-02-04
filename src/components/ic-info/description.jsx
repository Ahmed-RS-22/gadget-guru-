import  { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Description = () => {
      const { icInfo } = useOutletContext();
      const descripton = icInfo.Ic_details[0];      
      // State for parameters      
      const [descrip, setDescrip] = useState("");
     
      useEffect(() => {
        if (descripton && descripton.Description && descripton.Description.length > 0) {
            setDescrip(descripton.Description);
        }
      }, [descripton]); // Re-run when icInfo updates
      if (!icInfo || !icInfo.Ic_details || icInfo.Ic_details.length === 0) {
        return <p>Loading...</p>;
      }
      return (<>
      <div className="info-list description">
            <p>
                  {descrip}
            </p>
      </div>
      </>
      )
}
export default Description;