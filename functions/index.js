const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserAsAdmin = functions.https.onCall(async (data, context) => {
  // Check if the requester is already an admin
  if (!(context.auth && context.auth.token.admin === true)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can add other admins');
  }

  const { uid } = data;
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: 'Successfully set user as admin' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
}); 