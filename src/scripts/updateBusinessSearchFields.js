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

const generateSearchKeywords = (text) => {
  const words = text.toLowerCase().split(' ');
  const keywords = [];
  
  // Add full words
  words.forEach(word => keywords.push(word));
  
  // Add partial matches for each word
  words.forEach(word => {
    for (let i = 1; i <= word.length; i++) {
      keywords.push(word.substring(0, i));
    }
  });
  
  return [...new Set(keywords)]; // Remove duplicates
};

const updateBusinessSearchFields = async () => {
  try {
    const businessesRef = collection(db, 'businesses');
    const snapshot = await getDocs(businessesRef);
    
    for (const business of snapshot.docs) {
      const data = business.data();
      const searchKeywords = generateSearchKeywords(data.name);
      
      await updateDoc(doc(db, 'businesses', business.id), {
        searchKeywords,
        nameLower: data.name.toLowerCase()
      });
      console.log(`Updated search fields for ${data.name}`);
    }
    
    console.log('Successfully updated all businesses');
    process.exit(0);
  } catch (error) {
    console.error('Error updating businesses:', error);
    process.exit(1);
  }
};

updateBusinessSearchFields(); 