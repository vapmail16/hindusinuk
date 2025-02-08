import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

export const storyService = {
  // Get paginated stories
  async getStories(pageSize = 10, lastDoc = null) {
    let q = query(
      collection(db, 'mythologyStories'),
      orderBy('publishDate', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    return {
      stories: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  },

  // Get stories by deity
  async getStoriesByDeity(deity) {
    const q = query(
      collection(db, 'mythologyStories'),
      where('deities', 'array-contains', deity)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Add new story
  async addStory(storyData) {
    return await addDoc(collection(db, 'mythologyStories'), {
      ...storyData,
      publishDate: new Date(),
      wordCount: storyData.content.split(' ').length,
      approved: false // Requires admin approval
    });
  }
}; 