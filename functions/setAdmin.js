const admin = require('firebase-admin');

// Get this JSON from Firebase Console > Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hindusinuk.firebaseio.com"
});

// Replace this with your user ID from the console log
const uid = 'YOUR_USER_ID_HERE';  // Get this from the console.log we added

async function setAdmin() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Successfully set admin claim');
    
    // Verify the claim was set
    const user = await admin.auth().getUser(uid);
    console.log('User custom claims:', user.customClaims);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
  process.exit();
}

setAdmin(); 