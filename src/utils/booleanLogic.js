// Convert a number to binary string padded to a given length
export function getBinary(num, length) {
  let bin = num.toString(2);
  while (bin.length < length) {
    bin = "0" + bin;
  }
  return bin;
}

// Count the number of '1's in a binary string
export function countOnes(str) {
  return str.split("").filter((ch) => ch === "1").length;
}

// Generate Gray code order for n bits
export function getGrayCode(n) {
  if (n === 0) return [""];
  if (n === 1) return ["0", "1"];
  const prev = getGrayCode(n - 1);
  const result = [];
  
  for (let i = 0; i < prev.length; i++) {
    result.push("0" + prev[i]);
  }
  
  for (let i = prev.length - 1; i >= 0; i--) {
    result.push("1" + prev[i]);
  }
  
  return result;
}

// Combine two terms if they differ in exactly one position
function combineTerms(term1, term2) {
  let diffCount = 0;
  let combined = "";
  
  for (let i = 0; i < term1.length; i++) {
    if (term1[i] === term2[i]) {
      combined += term1[i];
    } else {
      diffCount++;
      combined += "-";
    }
  }
  
  return diffCount === 1 ? combined : null;
}

// Quine-McCluskey algorithm implementation
export function simplifyBoolean(minterms, numVariables) {
  // Special cases
  if (minterms.length === 0) return "0";
  if (minterms.length === Math.pow(2, numVariables)) return "1";
  
  // Convert minterms to binary
  let terms = minterms.map((m) => getBinary(m, numVariables));
  let groups = {};
  
  // Group terms by number of ones
  terms.forEach((term) => {
    const ones = countOnes(term);
    if (!groups[ones]) groups[ones] = [];
    groups[ones].push({ term, combined: false, covers: [term] });
  });

  let primeImplicants = [];
  let newCombination = true;
  let currentGroups = groups;
  
  // Find prime implicants
  while (newCombination) {
    newCombination = false;
    let nextGroups = {};
    let groupKeys = Object.keys(currentGroups)
      .map(Number)
      .sort((a, b) => a - b);
      
    for (let i = 0; i < groupKeys.length - 1; i++) {
      let group1 = currentGroups[groupKeys[i]];
      let group2 = currentGroups[groupKeys[i + 1]];
      
      for (let term1 of group1) {
        for (let term2 of group2) {
          let combinedTerm = combineTerms(term1.term, term2.term);
          if (combinedTerm !== null) {
            newCombination = true;
            term1.combined = true;
            term2.combined = true;
            
            let onesCombined = countOnes(combinedTerm.replace(/-/g, "0"));
            if (!nextGroups[onesCombined]) nextGroups[onesCombined] = [];
            
            // Check if this term already exists in the next group
            if (!nextGroups[onesCombined].some((item) => item.term === combinedTerm)) {
              nextGroups[onesCombined].push({
                term: combinedTerm,
                combined: false,
                covers: [...new Set([...term1.covers, ...term2.covers])],
              });
            }
          }
        }
      }
    }
    
    // Add uncombined terms to prime implicants
    for (let key in currentGroups) {
      for (let item of currentGroups[key]) {
        if (!item.combined && !primeImplicants.some((pi) => pi.term === item.term)) {
          primeImplicants.push(item);
        }
      }
    }
    
    currentGroups = nextGroups;
  }

  // Create prime implicant chart
  const implicantChart = primeImplicants.map((pi) => {
    const coveredNumbers = pi.covers.map((bin) => parseInt(bin, 2));
    return { term: pi.term, covers: coveredNumbers };
  });

  // Find essential prime implicants and remaining terms
  let finalImplicants = [];
  let remaining = [...minterms];
  
  // Find essential prime implicants (ones that are the only ones covering a minterm)
  for (let m of minterms) {
    const covers = implicantChart.filter((imp) => imp.covers.includes(m));
    if (covers.length === 1) {
      if (!finalImplicants.some((imp) => imp.term === covers[0].term)) {
        finalImplicants.push(covers[0]);
      }
    }
  }
  
  // Remove covered minterms
  remaining = remaining.filter(
    (m) => !finalImplicants.some((imp) => imp.covers.includes(m))
  );
  
  // Add remaining implicants to cover all minterms
  while (remaining.length > 0) {
    // Find implicant that covers the most remaining minterms
    let bestImplicant = null;
    let maxCovered = 0;
    
    for (const imp of implicantChart) {
      if (!finalImplicants.some((fi) => fi.term === imp.term)) {
        const covered = imp.covers.filter(m => remaining.includes(m)).length;
        if (covered > maxCovered) {
          maxCovered = covered;
          bestImplicant = imp;
        }
      }
    }
    
    if (bestImplicant && maxCovered > 0) {
      finalImplicants.push(bestImplicant);
      remaining = remaining.filter(m => !bestImplicant.covers.includes(m));
    } else {
      break; // Safety measure to prevent infinite loop
    }
  }

  // Convert implicants to product terms
  const varNames = ["A", "B", "C", "D"].slice(0, numVariables);
  const termsStr = finalImplicants.map((imp) => {
    let term = imp.term.split('');
    let termStr = "";
    
    for (let i = 0; i < term.length; i++) {
      if (term[i] === "-") continue;
      termStr += term[i] === "1" ? varNames[i] : `!${varNames[i]}`;
    }
    
    return termStr === "" ? "1" : termStr;
  });
  
  return termsStr.join(" + ") || "0";
}