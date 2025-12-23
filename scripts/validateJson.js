#!/usr/bin/env node

/**
 * JSON Validation Script
 * 
 * This script validates the JSON structure of data files without connecting to Firebase.
 * 
 * Usage:
 *   node scripts/validateJson.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n=================================');
console.log('JSON Validator');
console.log('=================================\n');

// Validate styleVibeGuides.json
const dataPath = path.join(__dirname, '../data/styleVibeGuides.json');
console.log(`📂 Validating: ${dataPath}\n`);

let data;
try {
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(fileContent);
  console.log('✅ JSON syntax is valid\n');
} catch (error) {
  console.error('❌ JSON parsing error:', error.message);
  process.exit(1);
}

// Validate structure
console.log('🔍 Validating structure...\n');

if (!data.collection) {
  console.error('❌ Missing "collection" field');
  process.exit(1);
}

if (!Array.isArray(data.documents)) {
  console.error('❌ "documents" field must be an array');
  process.exit(1);
}

console.log(`Collection: ${data.collection}`);
console.log(`Documents: ${data.documents.length}\n`);

// Validate each document
let errorCount = 0;
const errors = [];

data.documents.forEach((doc, index) => {
  const docErrors = [];
  
  if (!doc.id) docErrors.push('Missing "id" field');
  if (!doc.name) docErrors.push('Missing "name" field');
  if (!doc.visualDescription) docErrors.push('Missing "visualDescription" field');
  
  if (!Array.isArray(doc.keyPalette)) {
    docErrors.push('"keyPalette" must be an array');
  } else if (doc.keyPalette.length === 0) {
    docErrors.push('"keyPalette" array is empty');
  } else {
    doc.keyPalette.forEach((color, colorIndex) => {
      if (typeof color !== 'string') {
        docErrors.push(`keyPalette[${colorIndex}] must be a string`);
      } else if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        docErrors.push(`Invalid hex color "${color}" at keyPalette[${colorIndex}]`);
      }
    });
  }
  
  if (!Array.isArray(doc.activities)) {
    docErrors.push('"activities" must be an array');
  } else if (doc.activities.length === 0) {
    docErrors.push('"activities" array is empty');
  } else {
    doc.activities.forEach((activity, activityIndex) => {
      if (typeof activity !== 'string') {
        docErrors.push(`activities[${activityIndex}] must be a string`);
      }
    });
  }
  
  if (docErrors.length > 0) {
    errorCount++;
    errors.push({
      index,
      id: doc.id || `document ${index}`,
      errors: docErrors
    });
  }
});

if (errorCount > 0) {
  console.error(`❌ Found ${errorCount} document(s) with errors:\n`);
  errors.forEach(({ id, errors }) => {
    console.error(`  Document: ${id}`);
    errors.forEach(error => console.error(`    - ${error}`));
    console.error('');
  });
  process.exit(1);
}

// Check for duplicate IDs
const ids = data.documents.map(doc => doc.id).filter(id => id);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  console.error('❌ Duplicate IDs found');
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  console.error(`  Duplicates: ${[...new Set(duplicates)].join(', ')}\n`);
  process.exit(1);
}

console.log('✅ All documents are valid\n');
console.log('=================================');
console.log('Validation Summary');
console.log('=================================');
console.log(`Total documents: ${data.documents.length}`);
console.log(`Valid documents: ${data.documents.length}`);
console.log(`Unique IDs: ${uniqueIds.size}`);
console.log('=================================\n');

console.log('✅ JSON validation completed successfully!\n');
