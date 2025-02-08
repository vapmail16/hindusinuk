import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export const quizService = {
  // Get random questions for a level
  async getRandomQuestions(level, count = 10) {
    const q = query(
      collection(db, 'quizQuestions'),
      where('level', '==', level),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Add new question
  async addQuestion(questionData) {
    const docRef = await addDoc(collection(db, 'quizQuestions'), {
      ...questionData,
      timestamp: new Date(),
      approved: false // Requires admin approval
    });
    return docRef.id;
  },

  // Get questions by category
  async getQuestionsByCategory(category) {
    const q = query(
      collection(db, 'quizQuestions'),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}; 