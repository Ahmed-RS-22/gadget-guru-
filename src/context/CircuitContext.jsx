import React, { createContext, useContext, useState } from 'react';
import { simplifyBoolean } from '../utils/booleanLogic';

const CircuitContext = createContext(undefined);

export const useCircuit = () => {
  const context = useContext(CircuitContext);
  if (context === undefined) {
    throw new Error('useCircuit must be used within a CircuitProvider');
  }
  return context;
};

export const CircuitProvider = ({ children }) => {
  const [numInputs, setNumInputs] = useState(2);
  const [outputs, setOutputs] = useState(new Array(Math.pow(2, numInputs)).fill(false));
  const [simplifiedExpr, setSimplifiedExpr] = useState('');

  // Reset outputs when number of inputs changes
  const handleSetNumInputs = (num) => {
    setNumInputs(num);
    setOutputs(new Array(Math.pow(2, num)).fill(false));
    setSimplifiedExpr('');
  };

  // Toggle an output value in the truth table
  const toggleOutput = (index) => {
    const newOutputs = [...outputs];
    newOutputs[index] = !newOutputs[index];
    setOutputs(newOutputs);
  };

  // Reset all outputs to false
  const resetOutputs = () => {
    setOutputs(new Array(Math.pow(2, numInputs)).fill(false));
    setSimplifiedExpr('');
  };

  // Run the boolean simplification algorithm
  const simplify = () => {
    const minterms = outputs
      .map((val, idx) => (val ? idx : null))
      .filter((m) => m !== null);
    
    if (minterms.length === 0) {
      setSimplifiedExpr('0');
    } else if (minterms.length === Math.pow(2, numInputs)) {
      setSimplifiedExpr('1');
    } else {
      const simplified = simplifyBoolean(minterms, numInputs);
      setSimplifiedExpr(simplified);
    }
  };

  const value = {
    numInputs,
    setNumInputs: handleSetNumInputs,
    outputs,
    toggleOutput,
    resetOutputs,
    simplifiedExpr,
    simplify,
  };

  return (
    <CircuitContext.Provider value={value}>
      {children}
    </CircuitContext.Provider>
  );
};