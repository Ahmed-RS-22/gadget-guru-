import React from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Code } from 'lucide-react';

const ExpressionDisplay = () => {
  const { simplifiedExpr } = useCircuit();

  if (!simplifiedExpr) return null;

  // Function to convert expression text to formatted JSX
  const formatExpression = (expr) => {
    if (!expr) return null;
    
    // Split by '+' to identify terms
    const terms = expr.split('+').map(term => term.trim());
    
    return (
      <div className="expression-formatted">
        {terms.map((term, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="expression-operator">+</span>
            )}
            <span className="expression-term">
              {term.split('').map((char, charIdx) => {
                if (char === '!') return <span key={charIdx} className="expression-negation">¬</span>;
                return <span key={charIdx} className={char.match(/[A-Z]/) ? "expression-variable" : ""}>{char}</span>;
              })}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <Code className="card-icon" />
        <h2 className="card-title">Simplified Expression</h2>
      </div>
      
      <div className="expression-content">
        {formatExpression(simplifiedExpr)}
      </div>
    </div>
  );
};

export default ExpressionDisplay;