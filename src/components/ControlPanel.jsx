import React from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Sliders, Minimize2, Copy, Check } from 'lucide-react';

const ControlPanel = () => {
  const { 
    numInputs, 
    setNumInputs, 
    simplify, 
    simplifiedExpr,
    resetOutputs
  } = useCircuit();
  const [copied, setCopied] = React.useState(false);

  const handleNumInputsChange = (e) => {
    setNumInputs(parseInt(e.target.value));
  };

  const copyToClipboard = () => {
    if (simplifiedExpr) {
      navigator.clipboard.writeText(simplifiedExpr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card control-panel">
      <div className="card-header">
        <Sliders className="card-icon" />
        <h2 className="card-title">Controls</h2>
      </div>
      
      <div className="form-group">
        <label htmlFor="numInputs" className="form-label">
          Number of Variables
        </label>
        <select
          id="numInputs"
          value={numInputs}
          onChange={handleNumInputsChange}
          className="form-select"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'variable' : 'variables'}
            </option>
          ))}
        </select>
        <p className="form-help">
          {numInputs === 4 ? 'Maximum variables reached' : `Variables: ${['A', 'B', 'C', 'D'].slice(0, numInputs).join(', ')}`}
        </p>
      </div>

      <button onClick={simplify} className="btn btn-primary">
        <Minimize2 className="btn-icon" />
        Simplify Expression
      </button>

      <button onClick={resetOutputs} className="btn btn-secondary">
        Reset Outputs
      </button>

      {simplifiedExpr && (
        <div className="expression-container">
          <h3 className="expression-title">Simplified Expression</h3>
          <div className="expression-content">
            {simplifiedExpr}
          </div>
          <button onClick={copyToClipboard} className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
            {copied ? (
              <>
                <Check className="btn-icon" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="btn-icon" />
                Copy Expression
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;