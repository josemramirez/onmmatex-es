'use client';

import { Chat } from '@/components/chat/chat';
import { Header } from '@/components/chat/site-header';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import * as Frigade from '@frigade/react';
import { useSession } from 'next-auth/react';

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

export default function UserDashboard() {
  const [totalTokens, setTotalTokens] = useState<string | null>(null);
  const [TotaltotalTokens, setTotalTotalTokens] = useState<string | null>(null);
  const [nameChat, setNameChat] = useState<string | null>(null);
  const [totalSaldo, setTotalSaldo] = useState<string | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const creditThreshold = 5;

  // Cargar totalSaldo desde localStorage al montar el componente
  useEffect(() => {
    const storedTotalSaldo = localStorage.getItem('totalSaldo');
    if (storedTotalSaldo) {
      setTotalSaldo(storedTotalSaldo);
    }
  }, []);

  // Guardar totalSaldo en localStorage cada vez que cambie
  useEffect(() => {
    if (totalSaldo !== null) {
      localStorage.setItem('totalSaldo', totalSaldo);
    }
  }, [totalSaldo]);

  // Mostrar u ocultar el anuncio basado en totalSaldo
  useEffect(() => {
    if (totalSaldo !== null && Number(totalSaldo) <= creditThreshold) {
      const hasDismissed = localStorage.getItem('subscriptionDismissed');
      if (!hasDismissed) {
        setShowSubscription(true);
      }
    } else {
      setShowSubscription(false);
    }
  }, [totalSaldo]);

  // Verificar estado del anuncio y manejar el contador de descartes
  const checkSubscriptionStatus = () => {
    if (totalSaldo === null || Number(totalSaldo) > creditThreshold) {
      setShowSubscription(false);
      return;
    }

    const dismissedCount = localStorage.getItem('subscriptionDismissedCount');
    if (dismissedCount) {
      const count = parseInt(dismissedCount, 10);
      if (count >= 2) {
        setShowSubscription(true);
        localStorage.removeItem('subscriptionDismissedCount');
      } else {
        localStorage.setItem('subscriptionDismissedCount', (count + 1).toString());
      }
    } else {
      setShowSubscription(true);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [totalSaldo]);

  const handleDismiss = () => {
    setShowSubscription(false);
    localStorage.setItem('subscriptionDismissed', 'true');
    const dismissedCount = localStorage.getItem('subscriptionDismissedCount');
    if (!dismissedCount) {
      localStorage.setItem('subscriptionDismissedCount', '1');
    } else {
      localStorage.setItem('subscriptionDismissedCount', (parseInt(dismissedCount, 10) + 1).toString());
    }
  };

  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const FRIGADE_API_KEY = 'api_public_yyocMAiZnoeY7W4Y0OoOLuzEG1iOMUarSPEi79mgLoJLQyGdnSv9uoHgvRXPZEoO';

  return (


    <main className="flex flex-col h-screen items-center p-4 bg-background">

<Frigade.Provider
    apiKey={FRIGADE_API_KEY}
    userId={userId}>

      <Header
        TotaltotalTokens={TotaltotalTokens ?? ''}
        totalTokens={totalTokens ?? ''}
        nameChat={nameChat ?? ''}
        totalSaldo={totalSaldo ?? ''}
      />
      <div>
        <h1> - </h1>
        <p> </p>
{/*}        {showSubscription && (
          <Frigade.Banner flowId="flow_ImV16KWs" />
        )}*/}
        {showSubscription && (
          <div
            className="subscription-modal"
            style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #dee2e6',
              borderRadius: '10px',
              padding: '20px',
              margin: '20px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
              ¡Te quedan menos de {formatTokens(creditThreshold)} créditos!
            </p>
            <p style={{ fontSize: '16px', color: '#333' }}>
              No te pierdas lo mejor de nuestras funciones. ¡Suscríbete ahora y sigue disfrutando sin límites!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
              <Button
                onClick={() => window.location.href = 'dashboard/subscription'}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Suscribirme
              </Button>
              <Button
                onClick={handleDismiss}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Ignorar
              </Button>
            </div>
          </div>
        )}

      </div>
      <Chat
        id="research"
        initialMessages={[]}
        setTotalTokens={setTotalTokens}
        setTotalTotalTokens={setTotalTotalTokens}
        setNameChat={setNameChat}
        setTotalSaldo={setTotalSaldo}
        totalTokens={totalTokens}
        TotaltotalTokens={TotaltotalTokens}
        nameChat={nameChat}
        totalSaldo={totalSaldo}
      />

</Frigade.Provider>

    </main>
    
  );
}