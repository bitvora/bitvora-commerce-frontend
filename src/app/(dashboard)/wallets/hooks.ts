import { getWalletTransactions } from '@/app/(dashboard)/wallets/actions';
import { WalletTransaction } from '@/types/wallets';
import { useEffect, useState } from 'react';

export function useAllWalletTransactions(account_id: string) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account_id) return;

    let isCancelled = false;

    const fetchAllTransactions = async (
      limit = 10,
      offset = 0,
      accumulated: WalletTransaction[] = []
    ) => {
      const result = await getWalletTransactions({ account_id, limit, offset });

      if (!result.success) {
        if (!isCancelled) {
          setError(result.error || 'Unknown error');
          setLoading(false);
        }
        return;
      }

      const currentData = result.data?.result?.transactions || [];
      const allData = [...accumulated, ...currentData];

      if (currentData.length < limit) {
        if (!isCancelled) {
          setTransactions(allData);
          setLoading(false);
        }
      } else {
        fetchAllTransactions(limit, offset + limit, allData);
      }
    };

    setLoading(true);
    setError(null);
    fetchAllTransactions();

    return () => {
      isCancelled = true;
    };
  }, [account_id]);

  return { transactions, loading, error };
}
