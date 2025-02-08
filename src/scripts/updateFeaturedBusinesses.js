const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateFeaturedBusinesses = async () => {
  try {
    const businessesRef = collection(db, 'businesses');
    const snapshot = await getDocs(businessesRef);
    
    // Get first two businesses and mark them as featured
    const businesses = snapshot.docs.slice(0, 2);
    
    for (const business of businesses) {
      await updateDoc(doc(db, 'businesses', business.id), {
        isFeatured: true,
        featuredOrder: businesses.indexOf(business)
      });
      console.log(`Marked ${business.data().name} as featured`);
    }
    
    console.log('Successfully updated featured businesses');
    process.exit(0);
  } catch (error) {
    console.error('Error updating featured businesses:', error);
    process.exit(1);
  }
};

updateFeaturedBusinesses(); 