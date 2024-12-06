import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TourismService } from '../types/services';

export const addToFavorites = async (userId: string, serviceId: string) => {
  if (!userId || !serviceId) {
    throw new Error('User ID and Service ID are required');
  }

  try {
    // Check if already favorited
    const existingFavorite = await checkIsFavorite(userId, serviceId);
    if (existingFavorite) {
      return; // Already favorited
    }

    await addDoc(collection(db, 'favorites'), {
      userId,
      serviceId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, serviceId: string) => {
  if (!userId || !serviceId) {
    throw new Error('User ID and Service ID are required');
  }

  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef, 
      where('userId', '==', userId),
      where('serviceId', '==', serviceId)
    );
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (userId: string): Promise<TourismService[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef, 
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const favoriteServices = await Promise.all(
      snapshot.docs.map(async (favoriteDoc) => {
        const serviceDoc = await getDoc(doc(db, 'services', favoriteDoc.data().serviceId));
        if (!serviceDoc.exists()) return null;
        return {
          id: serviceDoc.id,
          ...serviceDoc.data()
        } as TourismService;
      })
    );

    return favoriteServices.filter((service): service is TourismService => service !== null);
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const checkIsFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  if (!userId || !serviceId) {
    throw new Error('User ID and Service ID are required');
  }

  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('serviceId', '==', serviceId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};