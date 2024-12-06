import { useState, useEffect } from 'react';
import { messagesQuery } from '../lib/firebase/indexes';
import { Message } from '../types';
import { onSnapshot } from 'firebase/firestore';

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = messagesQuery(chatId);
    
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading };
}