import React from "react";
import { CircuitProvider } from  "../context/CircuitContext";
import KMapSimplifier from "../components/KMapSimplifier";
 const Logic=()=>{
      return (
    <div className="app">
      <CircuitProvider>
        <KMapSimplifier />
      </CircuitProvider>
    </div>
  );
 }
export default Logic;