// Script to generate HWI insurance data from hwi.json
const fs = require('fs');
const path = require('path');

// Read the hwi.json file
const hwiJsonPath = path.join(__dirname, '..', 'docs', 'hwi.json');
const hwiData = JSON.parse(fs.readFileSync(hwiJsonPath, 'utf8'));

// Transform the data
const transformedData = hwiData
  .filter(entry => {
    // Filter out invalid entries
    const poolAmount = entry["Pool Amount"];
    const insurance = entry["Insurance"];
    
    // Skip entries with invalid pool amounts or empty insurance
    return typeof poolAmount === 'number' && 
           poolAmount > 1000 && 
           insurance && 
           insurance.trim() !== '';
  })
  .map(entry => {
    const poolAmount = entry["Pool Amount"];
    let insuranceString = entry["Insurance"];
    
    // Clean up the insurance string - remove $ and commas, convert to number
    const insuranceCost = parseFloat(
      insuranceString
        .replace(/^\$\s*/, '') // Remove leading $ and spaces
        .replace(/,/g, '')     // Remove commas
        .trim()
    );
    
    return {
      poolAmount: Math.round(poolAmount),
      insuranceCost: Math.round(insuranceCost * 100) / 100 // Round to 2 decimal places
    };
  })
  .filter(entry => !isNaN(entry.insuranceCost)) // Remove entries with invalid insurance costs
  .sort((a, b) => a.poolAmount - b.poolAmount); // Sort by pool amount

// Generate TypeScript content
const typeScriptContent = `// HWI (Home Warranty Insurance) types and lookup data
// Generated from docs/hwi.json

export interface HWIInsuranceEntry {
  poolAmount: number;
  insuranceCost: number;
}

// HWI Insurance lookup table based on pool amount
export const HWI_INSURANCE_TABLE: HWIInsuranceEntry[] = ${JSON.stringify(transformedData, null, 2)};

/**
 * Lookup HWI insurance cost based on pool total cost
 * Rounds down to nearest thousand and finds the corresponding insurance cost
 * @param totalCost - Total contract cost
 * @returns Insurance cost for the rounded down amount
 */
export function getHWIInsuranceCost(totalCost: number): number {
  // Round down to nearest 1000
  const roundedAmount = Math.floor(totalCost / 1000) * 1000;
  
  // Find the entry with the closest pool amount (not exceeding the rounded amount)
  let bestMatch = HWI_INSURANCE_TABLE[0]; // Default to minimum
  
  for (const entry of HWI_INSURANCE_TABLE) {
    if (entry.poolAmount <= roundedAmount) {
      bestMatch = entry;
    } else {
      break; // Since table is ordered, we can break early
    }
  }
  
  return bestMatch.insuranceCost;
}

/**
 * Get the rounded down amount used for HWI lookup
 * @param totalCost - Total contract cost
 * @returns Rounded down amount to nearest 1000
 */
export function getHWILookupAmount(totalCost: number): number {
  return Math.floor(totalCost / 1000) * 1000;
}
`;

// Write the TypeScript file
const outputPath = path.join(__dirname, '..', 'src', 'types', 'hwi-insurance.ts');
fs.writeFileSync(outputPath, typeScriptContent);

console.log(`Generated HWI insurance data with ${transformedData.length} entries`);
console.log(`Output written to: ${outputPath}`);
console.log(`Pool amount range: $${transformedData[0].poolAmount.toLocaleString()} - $${transformedData[transformedData.length - 1].poolAmount.toLocaleString()}`);
console.log(`Insurance cost range: $${transformedData[0].insuranceCost.toLocaleString()} - $${transformedData[transformedData.length - 1].insuranceCost.toLocaleString()}`);