import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

// Required indexes for messages collection
export const messagesQuery = (chatId: string) => 
  query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );

// Required indexes for chats collection
export const chatsQuery = (userId: string) =>
  query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

// Required indexes for services collection
export const servicesQuery = (location: string) =>
  query(
    collection(db, 'services'),
    where('location', '>=', location.toLowerCase()),
    where('location', '<=', location.toLowerCase() + '\uf8ff'),
    orderBy('createdAt', 'desc')
  );