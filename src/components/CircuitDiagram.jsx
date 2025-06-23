import React, { useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { BrainCircuit as CircuitIcon } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';
import { generateCircuitDiagram } from '../utils/circuitGenerator';

const CircuitDiagram = () => {
  const { simplifiedExpr, numInputs } = useCircuit();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Create circuit diagram when expression changes
  useEffect(() => {
    if (simplifiedExpr) {
      const { nodes: newNodes, edges: newEdges } = generateCircuitDiagram(simplifiedExpr, numInputs);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [simplifiedExpr, numInputs, setNodes, setEdges]);

  return (
    <div>
      <div className="card-header">
        <CircuitIcon className="card-icon" />
        <h2 className="card-title">Circuit Diagram</h2>
      </div>
      
      <div className="circuit-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <Background color="#475569" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CircuitDiagram;