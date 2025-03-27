'use client';

import { fetchSession } from '@/app/(dashboard)/actions';
import { currencies } from '@/lib/constants';
import { CurrencyType, SessionPayload } from '@/lib/types';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import secureLocalStorage from 'react-secure-storage';

interface AppContextType {
  session: SessionPayload;
  currency: CurrencyType;
  updateCurrency: (currency: CurrencyType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [session, setSession] = useState<SessionPayload>({} as SessionPayload);
  const [currency, setCurrency] = useState<CurrencyType | null>(null);

  const updateCurrency = (currency: CurrencyType) => {
    setCurrency(currency);
    secureLocalStorage.setItem('currency', JSON.stringify(currency));
  };

  useEffect(() => {
    const storedCurrency = secureLocalStorage.getItem('currency');

    if (storedCurrency && typeof storedCurrency === 'string') {
      try {
        const parsedCurrency = JSON.parse(storedCurrency) as CurrencyType;
        setCurrency(parsedCurrency);
      } catch {
        setCurrency(currencies[0]);
      }
    } else {
      setCurrency(currencies[0]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const session = await fetchSession();

      if (session) {
        setSession(session);
      }
    };

    fetchData();
  }, []);

  const values = useMemo(() => {
    return {
      currency,
      session,
      updateCurrency
    };
  }, [currency, session]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={values}>{children}</AppContext.Provider>{' '}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};
