import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Image as ImageIcon, Paperclip, Smile, Minimize2, Maximize2 } from 'lucide-react';
import { Message, sendMessage, subscribeToMessages, markMessagesAsRead } from '../../services/chat';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  recipientId: string;
}

export function ChatModal({ isOpen, onClose, chatId, recipientId }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const unsubscribe = subscribeToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
      markMessagesAsRead(chatId, currentUser.uid);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      setLoading(true);
      await sendMessage(chatId, currentUser.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm');
    }

    if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, "d 'de' MMMM", { locale: ptBR });
    }

    return format(messageDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (!isOpen) return null;

  return (
    <div className={`
      fixed bottom-0 right-4 z-50
      ${isMinimized ? 'w-72' : 'w-96 h-[600px]'}
      bg-white rounded-t-lg shadow-xl flex flex-col
      transition-all duration-200
    `}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-primary text-white rounded-t-lg">
        <h3 className="font-medium">Chat</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                new Date(message.createdAt?.toDate()).toDateString() !== 
                new Date(messages[index - 1].createdAt?.toDate()).toDateString();

              return (
                <React.Fragment key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-4 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                        {formatMessageDate(message.createdAt?.toDate())}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                      max-w-[70%] rounded-2xl px-4 py-2 shadow-sm
                      ${message.senderId === currentUser?.uid 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white rounded-bl-none'
                      }
                    `}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`
                        flex items-center gap-1 text-xs mt-1
                        ${message.senderId === currentUser?.uid ? 'text-primary-light' : 'text-gray-400'}
                      `}>
                        {format(message.createdAt?.toDate(), 'HH:mm')}
                        {message.read && message.senderId === currentUser?.uid && (
                          <span>• Lida</span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary focus:ring-primary pr-12 min-h-[80px] resize-none"
                  disabled={loading}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading || !newMessage.trim()}
                className="h-10 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}