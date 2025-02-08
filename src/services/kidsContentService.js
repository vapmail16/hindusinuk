import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const kidsContentService = {
  // Quiz Methods
  async getQuizQuestions(level) {
    try {
      console.log('Fetching quiz questions for level:', level);
      const q = query(
        collection(db, 'quizQuestions'), 
        where('level', '==', level)
      );
      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched questions:', questions);
      return questions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  },

  // Mythology Stories Methods
  async getMythologyStories() {
    try {
      console.log('Fetching mythology stories');
      const snapshot = await getDocs(collection(db, 'mythologyStories'));
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched stories:', stories);
      return stories;
    } catch (error) {
      console.error('Error fetching mythology stories:', error);
      throw error;
    }
  },

  // YouTube Videos Methods
  async getYoutubeVideos() {
    try {
      console.log('Fetching youtube videos');
      const snapshot = await getDocs(collection(db, 'youtubeVideos'));
      const videos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched videos:', videos);
      return videos;
    } catch (error) {
      console.error('Error fetching youtube videos:', error);
      throw error;
    }
  }
}; 