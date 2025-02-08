import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import quizData from '../data/full_quiz_questions.json';
import mythologyData from '../data/full_mythology_stories.json';
import youtubeData from '../data/full_youtube_videos.json';

async function uploadData() {
  try {
    // Upload Quiz Questions
    const quizRef = collection(db, 'quizQuestions');
    for (const question of quizData) {
      await addDoc(quizRef, question);
    }

    // Upload Mythology Stories
    const mythologyRef = collection(db, 'mythologyStories');
    for (const story of mythologyData) {
      await addDoc(mythologyRef, story);
    }

    // Upload YouTube Videos
    const videosRef = collection(db, 'youtubeVideos');
    for (const video of youtubeData) {
      await addDoc(videosRef, video);
    }

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
}

uploadData(); 