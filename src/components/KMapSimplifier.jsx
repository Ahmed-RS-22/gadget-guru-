import React from 'react';
import ControlPanel from './ControlPanel';
import KarnaughMap from './KarnaughMap';
import TruthTable from './TruthTable';
import CircuitDiagram from './CircuitDiagram';
import ExpressionDisplay from './ExpressionDisplay';
import { useCircuit } from '../context/CircuitContext';
import { Cpu, AlertTriangle } from 'lucide-react';

const KMapSimplifier = () => {
  const { simplifiedExpr } = useCircuit();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title">
          <Cpu className="card-icon" size={32} />
          <h1>Karnaugh Map Simplifier</h1>
        </div>
        <p className="app-subtitle">
          Simplify Boolean expressions with interactive truth tables, Karnaugh maps, and circuit visualization
        </p>
      </header>

      <div className="main-grid">
        {/* Control Panel */}
        <div>
          <ControlPanel />
        </div>

        {/* Main Content */}
        <div>
          <div className="content-grid">
            {/* Karnaugh Map */}
            <div>
              <KarnaughMap />
            </div>

            {/* Truth Table */}
            <div>
              <TruthTable />
            </div>
          </div>

          {/* Expression Display */}
          {simplifiedExpr ? (
            <div className="full-width" style={{ marginBottom: '2rem' }}>
              <ExpressionDisplay />
            </div>
          ) : (
            <div className="alert full-width" style={{ marginBottom: '2rem' }}>
              <AlertTriangle className="alert-icon" />
              <p>Select outputs in the truth table and click 'Simplify' to see results</p>
            </div>
          )}

          {/* Circuit Diagram */}
          {simplifiedExpr && (
            <div className="card full-width">
              <CircuitDiagram />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KMapSimplifier;