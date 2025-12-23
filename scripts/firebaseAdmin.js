// Shared Firebase Admin initialization for scripts

// Try to load dotenv if available, but don't fail if it's not
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not installed, will check for env vars later
}

let cachedDb;

function getFirestore() {
  if (cachedDb) {
    return cachedDb;
  }

  console.log('🔥 Initializing Firebase Admin...');

  let admin;
  try {
    admin = require('firebase-admin');
  } catch (error) {
    console.error('❌ Firebase Admin SDK not found. Please run: npm install');
    process.exit(1);
  }

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
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n')
        })
      });
    }
    console.log(`✅ Connected to Firebase project: ${projectId}\n`);
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    process.exit(1);
  }

  cachedDb = admin.firestore();
  return cachedDb;
}

module.exports = {
  getFirestore
};
