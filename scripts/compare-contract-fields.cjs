#!/usr/bin/env node

/**
 * Script to compare contract output fields and find missing fields
 * 
 * Compares docs/contract-outputfields-raw.json against docs/submission-current.json
 * and outputs missing fields to missing-contract-fields.json
 */

const fs = require('fs');
const path = require('path');

// Paths relative to project root
const PROJECT_ROOT = path.join(__dirname, '..');
const CONTRACT_FIELDS_PATH = path.join(PROJECT_ROOT, 'docs/contract-outputfields-raw.json');
const SUBMISSION_CURRENT_PATH = path.join(PROJECT_ROOT, 'docs/submission-current.json');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'scripts/missing-contract-fields.json');

// Fields that are intentionally excluded from the comparison (not needed in current implementation)
const EXCLUDED_FIELDS = [
  "7 Star",
  "8 Star", 
  "9 Star",
  "Bobcat Price",
  "C-Item 8 Need Information",
  "Extra LED Lights",
  "Special Conditions",
  "Prop Extra Paving",
  "Prop Pool Price"
];

function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    process.exit(1);
  }
}

function getFieldsFromObject(obj) {
  if (Array.isArray(obj)) {
    // If it's an array, get fields from the first object
    return obj.length > 0 ? Object.keys(obj[0]) : [];
  } else if (typeof obj === 'object' && obj !== null) {
    // If it's an object, get its keys
    return Object.keys(obj);
  }
  return [];
}

function main() {
  console.log('🔍 Comparing contract output fields...');
  
  // Load both JSON files
  console.log(`📖 Loading ${CONTRACT_FIELDS_PATH}`);
  const contractFields = loadJsonFile(CONTRACT_FIELDS_PATH);
  
  console.log(`📖 Loading ${SUBMISSION_CURRENT_PATH}`);
  const submissionCurrent = loadJsonFile(SUBMISSION_CURRENT_PATH);
  
  // Extract field names from both files
  const allExpectedFields = getFieldsFromObject(contractFields);
  const currentFields = getFieldsFromObject(submissionCurrent);
  
  // Filter out excluded fields from expected fields
  const expectedFields = allExpectedFields.filter(field => !EXCLUDED_FIELDS.includes(field));
  
  console.log(`✅ Found ${allExpectedFields.length} total fields in contract-outputfields-raw.json`);
  console.log(`✅ Excluding ${EXCLUDED_FIELDS.length} unneeded fields`);
  console.log(`✅ Found ${expectedFields.length} required fields after exclusions`);
  console.log(`✅ Found ${currentFields.length} current fields in submission-current.json`);
  
  // Find missing fields (fields in expected but not in current)
  const missingFields = expectedFields.filter(field => !currentFields.includes(field));
  
  // Find extra fields (fields in current but not in expected) - for reference
  const extraFields = currentFields.filter(field => !expectedFields.includes(field));
  
  // Create result object
  const result = {
    metadata: {
      analysis_date: new Date().toISOString(),
      expected_fields_file: 'docs/contract-outputfields-raw.json',
      current_fields_file: 'docs/submission-current.json',
      total_raw_expected_fields: allExpectedFields.length,
      excluded_fields_count: EXCLUDED_FIELDS.length,
      total_required_fields: expectedFields.length,
      total_current_fields: currentFields.length,
      missing_fields_count: missingFields.length,
      extra_fields_count: extraFields.length
    },
    excluded_fields: EXCLUDED_FIELDS.sort(),
    missing_fields: missingFields.sort(),
    extra_fields: extraFields.sort(),
    all_required_fields: expectedFields.sort(),
    all_current_fields: currentFields.sort()
  };
  
  // Write result to output file
  console.log(`💾 Writing results to ${OUTPUT_PATH}`);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  
  // Print summary
  console.log('\n📊 Analysis Summary:');
  console.log(`   Total raw expected fields: ${allExpectedFields.length}`);
  console.log(`   Excluded (unneeded) fields: ${EXCLUDED_FIELDS.length}`);
  console.log(`   Required fields: ${expectedFields.length}`);
  console.log(`   Current fields:  ${currentFields.length}`);
  console.log(`   Missing fields:  ${missingFields.length}`);
  console.log(`   Extra fields:    ${extraFields.length}`);
  
  if (missingFields.length > 0) {
    console.log('\n❌ Missing fields:');
    missingFields.forEach(field => console.log(`   • ${field}`));
  }
  
  if (extraFields.length > 0) {
    console.log('\n➕ Extra fields (in current but not expected):');
    extraFields.forEach(field => console.log(`   • ${field}`));
  }
  
  if (missingFields.length === 0) {
    console.log('\n🎉 All expected fields are present in the current submission!');
  }
  
  console.log(`\n📄 Full results written to: ${path.relative(PROJECT_ROOT, OUTPUT_PATH)}`);
}

if (require.main === module) {
  main();
}

module.exports = { main, getFieldsFromObject };