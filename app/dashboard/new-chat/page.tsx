'use client';

import { useState } from 'react';
import { Chat } from '@/components/chat/chat';
import { Header } from '@/components/chat/site-header';

export default function UserNewChat() {
  // Define el estado totalTokens en el componente padre
  const [totalTokens, setTotalTokens] = useState<string | null>(null);
  const [TotaltotalTokens, setTotalTotalTokens] = useState<string | null>(null);
  const [nameChat, setNameChat] = useState<string | null>(null);
  const [totalSaldo, setTotalSaldo] = useState<string | null>(null);

  const nameChatH = nameChat?.slice(0,35)+" ";

  function formatTokens(tokens: number): string {
    if (tokens < 1000) {
      return `${tokens}`;
    } else if (tokens < 1000000) {
      const kValue = tokens / 1000;
      const formatted = kValue % 1 === 0 ? kValue.toString() : kValue.toFixed(1);
      return `${formatted}k`;
    } else {
      const mValue = tokens / 1000000;
      const formatted = mValue % 1 === 0 ? mValue.toString() : mValue.toFixed(1);
      return `${formatted}M`;
    }
  }
  
  const totalTokensH = formatTokens(Number(totalTokens));

  return (
    <main className="flex flex-col h-screen items-center p-4 bg-background">
      {/* Pasa totalTokens a Header */}
      <Header 
      TotaltotalTokens={TotaltotalTokens ?? ''} 
      totalTokens={totalTokens ?? ''} 
      nameChat={nameChatH ?? ''}
      totalSaldo={totalSaldo ?? ''} 
      />
      {/* Pasa setTotalTokens a Chat para que pueda actualizar el estado */}
      <Chat
        id="research"
        initialMessages={[]}
        setTotalTokens={setTotalTokens}
        setTotalTotalTokens={setTotalTotalTokens}
        setNameChat={setNameChat}
        setTotalSaldo={setTotalSaldo}
        totalTokens={totalTokensH}
        TotaltotalTokens={TotaltotalTokens}
        nameChat={nameChat}
        totalSaldo={totalSaldo}
        />
    </main>
  );
}
