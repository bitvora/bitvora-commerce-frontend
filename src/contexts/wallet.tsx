'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { WalletTransaction } from '@/types/wallets';
import { getWalletTransactions } from '@/app/(dashboard)/wallets/actions';
import { useAppContext } from '@/contexts';

type WalletTransactionsContextType = {
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
};

const WalletTransactionsContext = createContext<WalletTransactionsContextType | undefined>(
  undefined
);

export function WalletTransactionsProvider({ children }: { children: ReactNode }) {
  const { currentAccount } = useAppContext();
  const account_id = currentAccount?.id;

  const [rawTransactions, setRawTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(new Date('2025-01-01'));
  const [endDate, setEndDate] = useState(new Date());

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
      setRawTransactions(allData);
      setLoading(false);
    } else {
      fetchAllTransactions(limit, offset + limit, allData);
    }
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    setRawTransactions([]);
    fetchAllTransactions();
  };

  useEffect(() => {
    if (!account_id) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_id]);

  const transactions = useMemo(() => {
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(23, 59, 59, 999));

    return rawTransactions.filter((tx) => {
      const txDate = new Date(tx.created_at * 1000);
      return txDate >= start && txDate <= end;
    });
  }, [rawTransactions, startDate, endDate]);

  return (
    <WalletTransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        refetch,
        startDate,
        endDate,
        setStartDate,
        setEndDate
      }}>
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
