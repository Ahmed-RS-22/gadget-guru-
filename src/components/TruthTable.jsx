import React from 'react';
import { useCircuit } from '../context/CircuitContext';
import { FileText } from 'lucide-react';
import { getBinary } from '../utils/booleanLogic';

const TruthTable = () => {
  const { numInputs, outputs, toggleOutput } = useCircuit();
  
  // Generate variable names based on number of inputs
  const variableNames = ['A', 'B', 'C', 'D'].slice(0, numInputs);
  
  // Generate all possible input combinations
  const totalCombinations = Math.pow(2, numInputs);
  const combinations = Array.from({ length: totalCombinations }, (_, i) => i);

  return (
    <div className="card">
      <div className="card-header">
        <FileText className="card-icon" />
        <h2 className="card-title">Truth Table</h2>
      </div>
      
      <div className="truth-table-container">
        <table className="truth-table">
          <thead>
            <tr>
              <th className="index-cell">Index</th>
              {variableNames.map((name, idx) => (
                <th key={idx}>{name}</th>
              ))}
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {combinations.map((idx) => {
              const binary = getBinary(idx, numInputs);
              return (
                <tr key={idx}>
                  <td className="index-cell">{idx}</td>
                  {binary.split('').map((bit, bitIdx) => (
                    <td key={bitIdx}>{bit}</td>
                  ))}
                  <td>
                    <div 
                      className={`output-toggle ${outputs[idx] ? 'active' : 'inactive'}`}
                      onClick={() => toggleOutput(idx)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleOutput(idx);
                        }
                      }}
                    >
                      {outputs[idx] ? '1' : '0'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TruthTable;