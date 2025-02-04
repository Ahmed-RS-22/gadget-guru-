import { useEffect, useState } from "react";

const TruthTable = ({ data }) => {
  const [length, setLength] = useState(0);
  const [ttData, setTTData] = useState([]);
  useEffect(() => {
    setLength(data.length);
    setTTData(data);
  }, [data, ttData]);
  if (length === 8) {
    return (
      <div className="truth-table">
        <div className="t-row head">
          <span className="cell in">A</span>
          <span className="cell in">B</span>
          <span className="cell in">C</span>
          <span className="cell in">D</span>
          <span className="cell out">Output </span>
        </div>

        {ttData.map((item, index) => {
          return (
            <div className="t-row " key={index}>
              <span className="cell in">{item.Input[0]}</span>
              <span className="cell in">{item.Input[1]}</span>
              <span className="cell in">{item.Input[2]}</span>
              <span className="cell in">{item.Input[3]}</span>
              <span className="cell out">{item.Output} </span>
            </div>
          );
        })}
      </div>
    );
  } else if (length === 4) {
    return (
      <div className="truth-table">
        <div className="t-row head">
          <span className="cell in">A</span>
          <span className="cell in">B</span>
          <span className="cell out">Output </span>
        </div>

        {ttData.map((item, index) => {
          return (
            <div className="t-row " key={index}>
              <span className="cell in">{item.Input[0]}</span>
              <span className="cell in">{item.Input[1]}</span>
              <span className="cell out">{item.Output} </span>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="truth-table">
        <h2>there is no truth table </h2>
      </div>
    );
  }
};
export default TruthTable;
