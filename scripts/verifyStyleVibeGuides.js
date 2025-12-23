#!/usr/bin/env node

/**
 * Verification Script for Style & Vibe Guides
 * 
 * This script verifies that the styleVibeGuides data is correctly imported into Firestore.
 * 
 * Usage:
 *   node scripts/verifyStyleVibeGuides.js
 */

console.log('\n=================================');
console.log('Style & Vibe Guides Verifier');
console.log('=================================\n');

const { getFirestore } = require('./firebaseAdmin');
const db = getFirestore();

// Verify the data
async function verifyData() {
  console.log('🔍 Verifying Firestore data...\n');
  
  const collectionRef = db.collection('styleVibeGuides');
  
  try {
    const snapshot = await collectionRef.get();
    const documentCount = snapshot.size;
    
    console.log(`📊 Found ${documentCount} documents in 'styleVibeGuides' collection`);
    
    if (documentCount === 0) {
      console.error('❌ No documents found. Please run the seeding script first.\n');
      process.exit(1);
    }
    
    // Expected count
    const expectedCount = 65;
    if (documentCount !== expectedCount) {
      console.warn(`⚠️  Expected ${expectedCount} documents, but found ${documentCount}`);
    } else {
      console.log(`✅ Document count matches expected (${expectedCount})\n`);
    }
    
    // Validate document structure
    console.log('🔍 Validating document structure...\n');
    let validCount = 0;
    let invalidCount = 0;
    const errors = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      
      let isValid = true;
      
      if (!data.name) {
        errors.push(`${id}: Missing 'name' field`);
        isValid = false;
      }
      
      if (!data.visualDescription) {
        errors.push(`${id}: Missing 'visualDescription' field`);
        isValid = false;
      }
      
      if (!Array.isArray(data.keyPalette) || data.keyPalette.length === 0) {
        errors.push(`${id}: Invalid or empty 'keyPalette' array`);
        isValid = false;
      }
      
      if (!Array.isArray(data.activities) || data.activities.length === 0) {
        errors.push(`${id}: Invalid or empty 'activities' array`);
        isValid = false;
      }
      
      // Validate hex colors
      if (Array.isArray(data.keyPalette)) {
        data.keyPalette.forEach((color, index) => {
          if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
            errors.push(`${id}: Invalid hex color '${color}' at index ${index}`);
            isValid = false;
          }
        });
      }
      
      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
    });
    
    if (errors.length > 0) {
      console.error('❌ Validation errors found:\n');
      errors.forEach(error => console.error(`  - ${error}`));
      console.log('');
    }
    
    console.log('=================================');
    console.log('Verification Summary');
    console.log('=================================');
    console.log(`✅ Valid documents: ${validCount}`);
    if (invalidCount > 0) {
      console.log(`❌ Invalid documents: ${invalidCount}`);
    }
    console.log('=================================\n');
    
    if (invalidCount > 0) {
      console.error('⚠️  Some documents have validation errors. Please review and fix.\n');
      process.exit(1);
    }
    
    // Sample a few documents
    console.log('📋 Sample Documents:\n');
    let sampleCount = 0;
    snapshot.forEach(doc => {
      if (sampleCount < 3) {
        const data = doc.data();
        console.log(`  ${data.name} (${doc.id})`);
        console.log(`    Palette: ${data.keyPalette.join(', ')}`);
        console.log(`    Activities: ${data.activities.join(', ')}`);
        console.log('');
        sampleCount++;
      }
    });
    
    console.log('✅ Verification completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    process.exit(1);
  }
}

// Run the verifier
verifyData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
