import { 
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: any;
  read: boolean;
}

export interface Chat {
  id: string;
  customerId: string;
  supplierId: string;
  serviceId: string;
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount: number;
}

export const createChat = async (customerId: string, supplierId: string, serviceId: string) => {
  try {
    // Check if chat already exists
    const existingChat = await findExistingChat(customerId, supplierId, serviceId);
    if (existingChat) return existingChat;

    // Create new chat
    const chatRef = await addDoc(collection(db, 'chats'), {
      customerId,
      supplierId,
      serviceId,
      participants: [customerId, supplierId],
      createdAt: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      unreadCount: 0
    });

    return { 
      id: chatRef.id, 
      customerId, 
      supplierId, 
      serviceId,
      unreadCount: 0 
    };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const findExistingChat = async (customerId: string, supplierId: string, serviceId: string) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('customerId', '==', customerId),
    where('supplierId', '==', supplierId),
    where('serviceId', '==', serviceId)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Chat;
  }
  return null;
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  try {
    const messageRef = await addDoc(collection(db, 'messages'), {
      chatId,
      senderId,
      content,
      createdAt: serverTimestamp(),
      read: false
    });

    // Update chat's last message
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      unreadCount: increment(1)
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
};

export const subscribeToChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[];
    callback(chats);
  });
};

export const markMessagesAsRead = async (chatId: string, userId: string) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      where('read', '==', false),
      where('senderId', '!=', userId)
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);

    // Reset unread count
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, { unreadCount: 0 });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};