const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase config
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
const db = getFirestore(app);

const uploadData = async () => {
  try {
    // Read JSON files
    const dataDir = path.join(__dirname, '..', 'data');
    
    const quizData = JSON.parse(fs.readFileSync(path.join(dataDir, 'full_quiz_questions.json')));
    const mythologyData = JSON.parse(fs.readFileSync(path.join(dataDir, 'full_mythology_stories.json')));
    const youtubeData = JSON.parse(fs.readFileSync(path.join(dataDir, 'full_youtube_videos.json')));

    // Upload Quiz Questions
    console.log('Uploading quiz questions...');
    const quizRef = collection(db, 'quizQuestions');
    for (const question of quizData) {
      await addDoc(quizRef, question);
    }

    // Upload Mythology Stories
    console.log('Uploading mythology stories...');
    const mythologyRef = collection(db, 'mythologyStories');
    for (const story of mythologyData) {
      await addDoc(mythologyRef, story);
    }

    // Upload YouTube Videos
    console.log('Uploading youtube videos...');
    const videosRef = collection(db, 'youtubeVideos');
    for (const video of youtubeData) {
      await addDoc(videosRef, video);
    }

    console.log('All data uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading data:', error);
    process.exit(1);
  }
};

uploadData();