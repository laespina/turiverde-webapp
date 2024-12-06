import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};