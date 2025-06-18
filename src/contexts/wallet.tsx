'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletTransaction } from '@/types/wallets';
import { getWalletTransactions } from '@/app/(dashboard)/wallets/actions';
import { useAppContext } from '@/contexts';

type WalletTransactionsContextType = {
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const WalletTransactionsContext = createContext<WalletTransactionsContextType | undefined>(
  undefined
);

export function WalletTransactionsProvider({ children }: { children: ReactNode }) {
  const { currentAccount } = useAppContext();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const account_id = currentAccount?.id;

  const fetchAllTransactions = async (
    limit = 10,
    offset = 0,
    accumulated: WalletTransaction[] = []
  ) => {
    const result = await getWalletTransactions({ account_id, limit, offset });

    if (!result.success) {
      setError(result.error || 'Unknown error');
      setLoading(false);
      return;
    }

    const currentData = result.data?.result?.transactions || [];
    const allData = [...accumulated, ...currentData];

    if (currentData.length < limit) {
      setTransactions(allData);
      setLoading(false);
    } else {
      fetchAllTransactions(limit, offset + limit, allData);
    }
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    setTransactions([]);
    fetchAllTransactions();
  };

  useEffect(() => {
    if (!account_id) return;
    fetchAllTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_id]);

  return (
    <WalletTransactionsContext.Provider value={{ transactions, loading, error, refetch }}>
      {children}
    </WalletTransactionsContext.Provider>
  );
}

export function useWalletTransactions() {
  const context = useContext(WalletTransactionsContext);
  if (!context) {
    throw new Error('useWalletTransactions must be used within a WalletTransactionsProvider');
  }
  return context;
}
