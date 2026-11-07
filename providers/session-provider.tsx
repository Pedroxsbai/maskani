import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import * as React from 'react';

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
};

const SessionContext = React.createContext<SessionContextValue | null>(null);

type SessionProviderProps = {
  children: React.ReactNode;
};

function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return <SessionContext.Provider value={{ session, isLoading }}>{children}</SessionContext.Provider>;
}

function useSession(): SessionContextValue {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider.');
  }
  return context;
}

export { SessionProvider, useSession };
