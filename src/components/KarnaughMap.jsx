import React from 'react';
import { useCircuit } from '../context/CircuitContext';
import { getGrayCode } from '../utils/booleanLogic';
import { Map } from 'lucide-react';

const KarnaughMap = () => {
  const { numInputs, outputs, toggleOutput } = useCircuit();
  
  // Create K-map layout based on inputs
  const getKMapLayout = () => {
    if (numInputs === 1) {
      return [[0], [1]];
    } else if (numInputs === 2) {
      // For 2 variables: a common arrangement
      return [
        [0, 1],
        [2, 3],
      ];
    } else if (numInputs === 3) {
      const rows = getGrayCode(1);
      const cols = getGrayCode(2);
      return rows.map((row) =>
        cols.map((col) => parseInt(row + col, 2))
      );
    } else if (numInputs === 4) {
      const rows = getGrayCode(2);
      const cols = getGrayCode(2);
      return rows.map((row) =>
        cols.map((col) => parseInt(row + col, 2))
      );
    }
    return [];
  };

  const kMapLayout = getKMapLayout();
  
  // Generate column labels based on number of inputs
  const getColLabels = () => {
    if (numInputs === 1) return ['A'];
    if (numInputs === 2) return ['A\'B\'', 'A\'B'];
    if (numInputs === 3) return ['A\'B\'', 'A\'B', 'AB', 'AB\''];
    if (numInputs === 4) return ['C\'D\'', 'C\'D', 'CD', 'CD\''];
    return [];
  };

  // Generate row labels based on number of inputs
  const getRowLabels = () => {
    if (numInputs === 1) return ['A\'', 'A'];
    if (numInputs === 2) return ['C\'', 'C'];
    if (numInputs === 3) return ['C\'', 'C'];
    if (numInputs === 4) return ['A\'B\'', 'A\'B', 'AB', 'AB\''];
    return [];
  };

  const colLabels = getColLabels();
  const rowLabels = getRowLabels();

  return (
    <div className="card">
      <div className="card-header">
        <Map className="card-icon" />
        <h2 className="card-title">Karnaugh Map</h2>
      </div>
      
      <div className="kmap-table-container">
        <table className="kmap-table">
          <thead>
            <tr>
              <th></th>
              {colLabels.map((label, idx) => (
                <th key={idx}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kMapLayout.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <th>
                  {rowLabels[rowIdx]}
                </th>
                {row.map((cellValue, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={`kmap-cell ${outputs[cellValue] ? 'active' : ''}`}
                    onClick={() => toggleOutput(cellValue)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOutput(cellValue);
                      }
                    }}
                  >
                    <div className="kmap-cell-value">
                      {outputs[cellValue] ? '1' : '0'}
                    </div>
                    <div className="kmap-cell-index">
                      {cellValue}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KarnaughMap;