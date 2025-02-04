import react, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Package = () => {
  const { icInfo } = useOutletContext();
  const Pack = icInfo.Ic_details[0];

  // State for parameters
  const [Packages, setPakages] = useState([]);

  useEffect(() => {
    if (Pack && Pack.Packages && Pack.Packages.length > 0) {
      setPakages(Pack.Packages);
    }
  }, [Pack]); // Re-run when icInfo updates
  if (!icInfo || !icInfo.Ic_details || icInfo.Ic_details.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <ul className="info-list">
        {Packages.map((pack, index) => (
          <li key={index} className="item pins">
            <span>{pack.Package}</span>
            <span>{pack.Pins}</span>
            <span>{pack.Size}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
export default Package;
