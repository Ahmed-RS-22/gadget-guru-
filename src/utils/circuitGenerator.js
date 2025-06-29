// Generate Circuit Diagram for a Boolean expression
export function generateCircuitDiagram(expression, numInputs) {
  if (!expression || expression === '0' || expression === '1') {
    return { nodes: [], edges: [] };
  }
  
  const nodes = [];
  const edges = [];
  
  // Parse the expression first to understand the structure
  const productTerms = expression.split('+').map(term => term.trim());
  const varNames = ["A", "B", "C", "D"].slice(0, numInputs);
  
  // Analyze which variables are used in each term to optimize placement
  const termVariables = productTerms.map(term => {
    const literals = term.match(/!?[A-Z]/g) || [];
    return literals.map(lit => ({
      variable: lit.replace('!', ''),
      negated: lit.startsWith('!')
    }));
  });
  
  // Calculate optimal input positioning to minimize crossings
  const inputStartY = 50;
  const inputSpacing = 80;
  
  // Create input nodes with strategic positioning
  varNames.forEach((variable, index) => {
    nodes.push({
      id: `input_${variable}`,
      data: { label: variable },
      position: { x: 50, y: inputStartY + index * inputSpacing },
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
      sourcePosition: 'right',
    });
  });
  
  // Calculate center Y position
  const centerY = inputStartY + ((numInputs - 1) * inputSpacing) / 2;
  
  // Strategy 1: Layer-based positioning to minimize crossings
  const andGateStartX = 220;
  const layerSpacing = 150;
  const andGateIds = [];
  
  // Strategy 2: Sort terms by complexity and variable usage to optimize placement
  const sortedTerms = productTerms.map((term, index) => ({
    term,
    index,
    literals: term.match(/!?[A-Z]/g) || [],
    complexity: (term.match(/!?[A-Z]/g) || []).length
  })).sort((a, b) => {
    // Sort by complexity first, then by first variable used
    if (a.complexity !== b.complexity) return a.complexity - b.complexity;
    const aFirstVar = a.literals[0]?.replace('!', '') || 'Z';
    const bFirstVar = b.literals[0]?.replace('!', '') || 'Z';
    return aFirstVar.localeCompare(bFirstVar);
  });
  
  // Strategy 3: Vertical spacing based on variable usage patterns
  sortedTerms.forEach((termData, sortedIndex) => {
    const { term, index: originalIndex, literals } = termData;
    
    // Calculate optimal Y position to minimize crossings
    let optimalY = centerY;
    if (sortedTerms.length > 1) {
      // Distribute terms vertically with smart spacing
      const termSpacing = Math.min(100, 300 / sortedTerms.length);
      optimalY = centerY + (sortedIndex - (sortedTerms.length - 1) / 2) * termSpacing;
    }
    
    // For simple expressions with only one variable
    if (literals.length === 1) {
      const literal = literals[0];
      const variableName = literal.replace('!', '');
      const isNegated = literal.startsWith('!');
      
      const singleTermId = `term_${originalIndex}`;
      
      nodes.push({
        id: singleTermId,
        data: { 
          label: isNegated ? `¬${variableName}` : variableName 
        },
        position: { x: andGateStartX, y: optimalY },
        style: {
          background: isNegated ? '#ef4444' : '#22c55e',
          color: 'white',
          border: isNegated ? '2px solid #dc2626' : '2px solid #16a34a',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '14px',
          width: 80,
          textAlign: 'center',
        },
        targetPosition: 'left',
        sourcePosition: 'right',
      });
      
      // Strategy 4: Use custom edge paths to avoid intersections
      const inputNode = nodes.find(n => n.id === `input_${variableName}`);
      const inputY = inputNode?.position.y || 0;
      
      edges.push({
        id: `edge_input_${variableName}_to_${singleTermId}`,
        source: `input_${variableName}`,
        target: singleTermId,
        type: 'default',
        animated: false,
        label: isNegated ? 'NOT' : '',
        labelStyle: { 
          fill: isNegated ? '#ef4444' : '#22c55e', 
          fontWeight: 'bold',
          fontSize: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: `1px solid ${isNegated ? '#ef4444' : '#22c55e'}`
        },
        style: { 
          stroke: isNegated ? '#ef4444' : '#22c55e', 
          strokeWidth: 2
        },
      });
      
      andGateIds.push(singleTermId);
    } else {
      // For terms with multiple variables, create an AND gate
      const andGateId = `and_${originalIndex}`;
      
      nodes.push({
        id: andGateId,
        data: { label: 'AND' },
        position: { x: andGateStartX, y: optimalY },
        style: {
          background: '#22c55e',
          color: 'white',
          border: '2px solid #16a34a',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '14px',
          width: 80,
          textAlign: 'center',
        },
        targetPosition: 'left',
        sourcePosition: 'right',
      });
      
      // Strategy 5: Connect inputs in order to minimize crossings
      const sortedLiterals = literals.sort((a, b) => {
        const varA = a.replace('!', '');
        const varB = b.replace('!', '');
        return varNames.indexOf(varA) - varNames.indexOf(varB);
      });
      
      sortedLiterals.forEach((lit, litIndex) => {
        const variableName = lit.replace('!', '');
        const isNegated = lit.startsWith('!');
        
        edges.push({
          id: `edge_${variableName}_to_${andGateId}_${litIndex}`,
          source: `input_${variableName}`,
          target: andGateId,
          type: 'default',
          animated: false,
          label: isNegated ? 'NOT' : '',
          labelStyle: { 
            fill: isNegated ? '#ef4444' : '#22c55e', 
            fontWeight: 'bold',
            fontSize: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: `1px solid ${isNegated ? '#ef4444' : '#22c55e'}`
          },
          style: { 
            stroke: isNegated ? '#ef4444' : '#22c55e', 
            strokeWidth: 2
          },
        });
      });
      
      andGateIds.push(andGateId);
    }
  });
  
  // Strategy 6: Optimal OR gate placement
  if (andGateIds.length > 1) {
    const orGateId = 'or_gate';
    const orGateX = andGateStartX + layerSpacing;
    
    nodes.push({
      id: orGateId,
      data: { label: 'OR' },
      position: { x: orGateX, y: centerY },
      style: {
        background: '#f97316',
        color: 'white',
        border: '2px solid #ea580c',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        width: 80,
        textAlign: 'center',
      },
      targetPosition: 'left',
      sourcePosition: 'right',
    });
    
    // Connect AND gates to OR gate with optimized routing
    andGateIds.forEach((andId, index) => {
      edges.push({
        id: `edge_${andId}_to_${orGateId}`,
        source: andId,
        target: orGateId,
        type: 'default',
        animated: false,
        style: { 
          stroke: '#f97316', 
          strokeWidth: 2
        },
      });
    });
    
    // Add output node
    nodes.push({
      id: 'output',
      data: { label: 'F' },
      position: { x: orGateX + layerSpacing, y: centerY },
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
      targetPosition: 'left',
    });
    
    // Connect OR gate to output
    edges.push({
      id: 'edge_or_to_output',
      source: orGateId,
      target: 'output',
      type: 'default',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2 },
    });
  } else if (andGateIds.length === 1) {
    // Single term - direct connection to output
    const outputX = andGateStartX + layerSpacing;
    
    nodes.push({
      id: 'output',
      data: { label: 'F' },
      position: { x: outputX, y: centerY },
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
      targetPosition: 'left',
    });
    
    edges.push({
      id: `edge_${andGateIds[0]}_to_output`,
      source: andGateIds[0],
      target: 'output',
      type: 'default',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2 },
    });
  }
  
  return { nodes, edges };
}