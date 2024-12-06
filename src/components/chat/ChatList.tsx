import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Chat, subscribeToChats } from '../../services/chat';
import { getUserProfile } from '../../services/users';
import { MessageSquare } from 'lucide-react';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToChats(currentUser.uid, async (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Nenhuma conversa ainda</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`
            w-full p-4 text-left hover:bg-gray-50 transition-colors
            ${selectedChatId === chat.id ? 'bg-gray-50' : ''}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {userProfile?.activeRole === 'supplier' 
                  ? `Cliente #${chat.customerId.slice(0, 8)}`
                  : `Fornecedor #${chat.supplierId.slice(0, 8)}`
                }
              </p>
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              )}
            </div>
            {chat.unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}