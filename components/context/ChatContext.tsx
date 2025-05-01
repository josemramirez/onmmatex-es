// ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the Chat interface
interface Chat {
  id: string;
  setChats: (chats: Chat[]) => void; // Add this line
  nameChat: string;
  content: any[];
  typeShort: string;
  fileName: string;
}

// Define the context type
interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  isLoading: boolean;
  error: string | null;
}


// Create the context with proper typing
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook to use the context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

// Context provider to manage state
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Effect to load chats when the session changes
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      setError(null);
      const url = `/api/get-chatentries?userId=${encodeURIComponent(session.user.id)}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setChats(data);
          } else {
            console.error('Los datos no son un arreglo:', data);
            setChats([]);
            setError('Los datos recibidos no son válidos');
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los chats:', error);
          setChats([]);
          setError('Error al obtener los chats');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setChats([]);
      setError(null);
    }
  }, [session?.user?.id]);

  // Context value
  const value: ChatContextType = { chats, setChats, isLoading, error };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};