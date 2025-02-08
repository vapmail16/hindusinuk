import { db } from '../config/firebase';
import { 
  collection, addDoc, getDocs, query, 
  where, orderBy, limit, serverTimestamp,
  doc, writeBatch
} from 'firebase/firestore';
import { generateQuestions } from './aiQuestionGenerator';

export const questionService = {
  // Get questions for a specific level
  async getQuestionsForLevel(level, count = 10) {
    try {
      // Start with a simpler query first
      const q = query(
        collection(db, 'quizQuestions'),
        where('level', '==', level),
        where('used', '==', false)
        // We'll add other conditions after creating the first index
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      // The error will contain the link to create the index
      console.error('Error getting questions:', error);
      if (error.code === 'failed-precondition') {
        console.log('Please create the index using the link in the Firebase console error message');
      }
      throw error;
    }
  },

  // Mark questions as used
  async markQuestionsAsUsed(questionIds) {
    const batch = writeBatch(db);
    questionIds.forEach(id => {
      const ref = doc(db, 'quizQuestions', id);
      batch.update(ref, { used: true });
    });
    await batch.commit();
  },

  // Get question statistics
  async getQuestionStats() {
    const stats = {};
    for (let level = 1; level <= 5; level++) {
      const q = query(
        collection(db, 'quizQuestions'),
        where('level', '==', level)
      );
      const snapshot = await getDocs(q);
      stats[level] = {
        total: snapshot.size,
        unused: snapshot.docs.filter(doc => !doc.data().used).length
      };
    }
    return stats;
  }
}; 