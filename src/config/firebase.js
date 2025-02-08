import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByJnQClYordK5or_QvsuNRrk-dkdZI7h4",
  authDomain: "hindusinuk.firebaseapp.com",
  projectId: "hindusinuk",
  storageBucket: "hindusinuk.firebasestorage.app",
  messagingSenderId: "307350570631",
  appId: "1:307350570631:web:ff3b5e29d6d771917e9a22",
  measurementId: "G-Z8B1DCSYTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app; 