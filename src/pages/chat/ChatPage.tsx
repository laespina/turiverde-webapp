import React, { useState } from 'react';
import { ChatList } from '../../components/chat/ChatList';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { Chat } from '../../services/chat';
import { useAuth } from '../../contexts/AuthContext';

export function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { userProfile } = useAuth();

  const getRecipientId = (chat: Chat) => {
    return userProfile?.activeRole === 'supplier' ? chat.customerId : chat.supplierId;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-80 border-r bg-white">
        <ChatList
          onSelectChat={setSelectedChat}
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white">
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat.id}
            recipientId={getRecipientId(selectedChat)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
}