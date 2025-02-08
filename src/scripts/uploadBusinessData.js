const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();  // Add this line to use .env variables
const { prepareBusinessData } = require('../utils/businessUtils');

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

const sampleBusinesses = [
  {
    name: "Sharma's Indian Restaurant",
    description: "Authentic North Indian cuisine in the heart of London",
    logo: "/images/business-placeholder.png",  // Updated to use placeholder
    address: "123 High Street, London, W1 2AB",
    contact: {
      phone: "+44 20 1234 5678",
      email: "info@sharmasrestaurant.com",
      website: "https://sharmasrestaurant.com"
    },
    category: "Restaurant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Krishna Grocers",
    description: "Your one-stop shop for Indian groceries and spices",
    logo: "/images/business-placeholder.png",
    address: "45 Market Street, Birmingham, B1 1AA",
    contact: {
      phone: "+44 121 234 5678",
      email: "shop@krishnagrocers.co.uk",
      website: "https://krishnagrocers.co.uk"
    },
    category: "Grocery",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Patel Fashion House",
    description: "Traditional and modern Indian fashion wear",
    logo: "/images/business-placeholder.png",
    address: "78 Shopping Lane, Manchester, M1 2BB",
    contact: {
      phone: "+44 161 345 6789",
      email: "info@patelfashion.com",
      website: "https://patelfashion.com"
    },
    category: "Fashion",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ganesh Temple",
    description: "A spiritual center for the Hindu community",
    logo: "/images/business-placeholder.png",
    address: "15 Peace Road, Leicester, LE1 3CD",
    contact: {
      phone: "+44 116 456 7890",
      email: "info@ganeshtemple.org",
      website: "https://ganeshtemple.org"
    },
    category: "Religious",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ayurveda Wellness Center",
    description: "Traditional Indian healing and wellness treatments",
    logo: "/images/business-placeholder.png",
    address: "92 Health Street, Bristol, BS1 4EF",
    contact: {
      phone: "+44 117 567 8901",
      email: "care@ayurvedawellness.co.uk",
      website: "https://ayurvedawellness.co.uk"
    },
    category: "Health",
    createdAt: new Date(),
    updatedAt: new Date()
  }
].map(business => prepareBusinessData(business));

const uploadBusinesses = async () => {
  try {
    console.log('Initializing Firebase with config:', {
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
    });
    
    const businessesRef = collection(db, 'businesses');
    
    for (const business of sampleBusinesses) {
      await addDoc(businessesRef, business);
      console.log(`Added business: ${business.name}`);
    }
    
    console.log('All businesses uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading businesses:', error);
    console.error('Firebase config:', firebaseConfig);
    process.exit(1);
  }
};

uploadBusinesses(); 