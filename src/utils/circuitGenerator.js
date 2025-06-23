// Generate Circuit Diagram for a Boolean expression
export function generateCircuitDiagram(expression, numInputs) {
  if (!expression || expression === '0' || expression === '1') {
    return { nodes: [], edges: [] };
  }
  
  const nodes = [];
  const edges = [];
  
  // Create input nodes for each variable
  const varNames = ["A", "B", "C", "D"].slice(0, numInputs);
  varNames.forEach((variable, index) => {
    nodes.push({
      id: `input_${variable}`,
      data: { label: variable },
      position: { x: 0, y: 100 + index * 70 },
      type: 'input',
      style: { 
        background: '#6366f1', 
        color: 'white',
        border: '2px solid #8b5cf6',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
      },
    });
  });
  
  // Parse the expression (assuming Sum of Products form)
  const productTerms = expression.split('+').map(term => term.trim());
  const andGateIds = [];
  
  // Place product terms vertically
  productTerms.forEach((term, termIndex) => {
    const literals = term.match(/!?[A-Z]/g) || [];
    
    // For simple expressions with only one variable, connect directly to output
    if (literals.length === 1) {
      const literal = literals[0];
      const variableName = literal.replace('!', '');
      const isNegated = literal.startsWith('!');
      
      // If it's just a single term with no operation, connect directly to output
      const singleTermId = `term_${termIndex}`;
      nodes.push({
        id: singleTermId,
        data: { 
          label: isNegated ? `NOT ${variableName}` : variableName 
        },
        position: { x: 150, y: 100 + termIndex * 100 },
        style: {
          background: isNegated ? '#ef4444' : '#22c55e',
          color: 'white',
          border: isNegated ? '2px solid #dc2626' : '2px solid #16a34a',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '14px',
          width: 80,
        },
      });
      
      edges.push({
        id: `edge_input_${variableName}_to_${singleTermId}`,
        source: `input_${variableName}`,
        target: singleTermId,
        animated: false,
        style: { stroke: isNegated ? '#ef4444' : '#22c55e', strokeWidth: 2 },
      });
      
      andGateIds.push(singleTermId);
    } else {
      // For terms with multiple variables, create an AND gate
      const andGateId = `and_${termIndex}`;
      nodes.push({
        id: andGateId,
        data: { label: 'AND' },
        position: { x: 200, y: 100 + termIndex * 100 },
        style: {
          background: '#22c55e',
          color: 'white',
          border: '2px solid #16a34a',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '14px',
          width: 80,
        },
      });
      
      // Connect input nodes to AND gate
      literals.forEach((lit, litIndex) => {
        const variableName = lit.replace('!', '');
        const isNegated = lit.startsWith('!');
        
        edges.push({
          id: `edge_${variableName}_to_${andGateId}_${litIndex}`,
          source: `input_${variableName}`,
          target: andGateId,
          animated: false,
          label: isNegated ? 'NOT' : '',
          labelStyle: { fill: '#ef4444', fontWeight: 'bold' },
          style: { stroke: isNegated ? '#ef4444' : '#22c55e', strokeWidth: 2 },
        });
      });
      
      andGateIds.push(andGateId);
    }
  });
  
  // If there are multiple product terms, add an OR gate
  if (andGateIds.length > 1) {
    const orGateId = 'or_gate';
    
    // Calculate position based on AND gates
    const orGateY = andGateIds.reduce((sum, id) => {
      const node = nodes.find(n => n.id === id);
      return sum + (node ? node.position.y : 0);
    }, 0) / andGateIds.length;
    
    nodes.push({
      id: orGateId,
      data: { label: 'OR' },
      position: { x: 350, y: orGateY },
      style: {
        background: '#f97316',
        color: 'white',
        border: '2px solid #ea580c',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        width: 80,
      },
    });
    
    // Connect AND gates to OR gate
    andGateIds.forEach((andId, index) => {
      edges.push({
        id: `edge_${andId}_to_${orGateId}`,
        source: andId,
        target: orGateId,
        animated: false,
        style: { stroke: '#f97316', strokeWidth: 2 },
      });
    });
    
    // Add output node
    nodes.push({
      id: 'output',
      data: { label: 'F' },
      position: { x: 500, y: orGateY },
      type: 'output',
      style: {
        background: '#a855f7',
        color: 'white',
        border: '2px solid #9333ea',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
      },
    });
    
    // Connect OR gate to output
    edges.push({
      id: 'edge_or_to_output',
      source: orGateId,
      target: 'output',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2 },
    });
  } else if (andGateIds.length === 1) {
    // If there's only one product term, connect it directly to output
    nodes.push({
      id: 'output',
      data: { label: 'F' },
      position: { x: 350, y: nodes.find(n => n.id === andGateIds[0])?.position.y || 100 },
      type: 'output',
      style: {
        background: '#a855f7',
        color: 'white',
        border: '2px solid #9333ea',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
      },
    });
    
    edges.push({
      id: `edge_${andGateIds[0]}_to_output`,
      source: andGateIds[0],
      target: 'output',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2 },
    });
  }
  
  return { nodes, edges };
}