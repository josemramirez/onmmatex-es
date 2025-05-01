// useChats.ts
import { useChatContext } from '@/components/context/ChatContext';

export function useChats() {
  const context = useChatContext();
  return context; // Devuelve { chats, isLoading, error }
}