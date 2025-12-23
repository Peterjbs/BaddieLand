#!/usr/bin/env node

/**
 * Seed Script for Style & Vibe Guides
 * 
 * This script imports the styleVibeGuides data into Firebase Firestore.
 * 
 * Usage:
 *   node scripts/seedStyleVibeGuides.js          # Seed the data
 *   DRY_RUN=true node scripts/seedStyleVibeGuides.js  # Validate without writing
 */

// Try to load dotenv if available, but don't fail if it's not
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not installed, will check for env vars later
}

const fs = require('fs');
const path = require('path');

// Determine if this is a dry run
const isDryRun = process.env.DRY_RUN === 'true';

console.log('\n=================================');
console.log('Style & Vibe Guides Seeder');
console.log('=================================\n');

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No data will be written\n');
}

// Load the data file
const dataPath = path.join(__dirname, '../data/styleVibeGuides.json');
console.log(`📂 Loading data from: ${dataPath}`);

let data;
try {
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(fileContent);
  console.log(`✅ Loaded ${data.documents.length} documents\n`);
} catch (error) {
  console.error('❌ Error loading data file:', error.message);
  process.exit(1);
}

// Validate data structure
console.log('🔍 Validating data structure...');
const validationErrors = [];

data.documents.forEach((doc, index) => {
  if (!doc.id) validationErrors.push(`Document ${index}: Missing 'id' field`);
  if (!doc.name) validationErrors.push(`Document ${index}: Missing 'name' field`);
  if (!doc.visualDescription) validationErrors.push(`Document ${index}: Missing 'visualDescription' field`);
  if (!Array.isArray(doc.keyPalette)) validationErrors.push(`Document ${index}: 'keyPalette' must be an array`);
  if (!Array.isArray(doc.activities)) validationErrors.push(`Document ${index}: 'activities' must be an array`);
  
  // Validate hex colors
  if (Array.isArray(doc.keyPalette)) {
    doc.keyPalette.forEach((color, colorIndex) => {
      if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        validationErrors.push(`Document ${index} (${doc.id}): Invalid hex color '${color}' at index ${colorIndex}`);
      }
    });
  }
});

if (validationErrors.length > 0) {
  console.error('❌ Validation errors found:\n');
  validationErrors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('✅ Data structure validation passed\n');

// Check for duplicate IDs
const ids = data.documents.map(doc => doc.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.error('❌ Duplicate IDs found:', [...new Set(duplicateIds)]);
  process.exit(1);
}
console.log('✅ No duplicate IDs found\n');

// Print summary
console.log('📊 Data Summary:');
console.log(`   Collection: ${data.collection}`);
console.log(`   Total Documents: ${data.documents.length}`);
console.log(`   Sample Document: ${data.documents[0].name} (${data.documents[0].id})\n`);

if (isDryRun) {
  console.log('✅ Dry run validation completed successfully!');
  console.log('   Run without DRY_RUN=true to import data to Firestore.\n');
  process.exit(0);
}

// Initialize Firebase Admin
console.log('🔥 Initializing Firebase Admin...');

let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.error('❌ Firebase Admin SDK not found. Please run: npm install');
  process.exit(1);
}

// Check for Firebase credentials
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase credentials in environment variables.');
  console.error('   Please create a .env file with:');
  console.error('   - FIREBASE_PROJECT_ID');
  console.error('   - FIREBASE_CLIENT_EMAIL');
  console.error('   - FIREBASE_PRIVATE_KEY');
  console.error('\n   See docs/seeding.md for setup instructions.\n');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId,
      clientEmail: clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n')
    })
  });
  console.log(`✅ Connected to Firebase project: ${projectId}\n`);
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Seed the data
async function seedData() {
  console.log('📝 Starting data import...\n');
  
  const collectionRef = db.collection(data.collection);
  let successCount = 0;
  let errorCount = 0;
  
  for (const doc of data.documents) {
    try {
      await collectionRef.doc(doc.id).set({
        name: doc.name,
        visualDescription: doc.visualDescription,
        keyPalette: doc.keyPalette,
        activities: doc.activities
      });
      console.log(`✅ Imported: ${doc.name} (${doc.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error importing ${doc.id}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n=================================');
  console.log('Import Summary');
  console.log('=================================');
  console.log(`✅ Successful: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log('=================================\n');
  
  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run the seeder
seedData()
  .then(() => {
    console.log('🎉 Seeding completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
