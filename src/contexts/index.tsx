'use client';

import { fetchSession, getAccounts, getWallets, getBalance } from '@/lib/actions';
import { currencies, graph_periods } from '@/lib/constants';
import { Account, CurrencyType, SessionPayload } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Wallet } from '@/types/wallets';
import { setActiveAccount } from '@/lib/auth';

interface AppContextType {
  session: SessionPayload;
  currency: CurrencyType;
  updateCurrency: (currency: CurrencyType) => void;
  accounts: Account[];
  currentAccount: Account;
  isAccountLoading?: boolean;
  updateCurrentAccount: (account: Account) => void;
  refetchAccount: () => void;
  currentTab: string;
  updateCurrentTab: (payload: string) => void;
  wallets: Wallet[];
  isWalletLoading: boolean;
  refetchWallet: () => void;
  balance: number;
  isBalanceLoading: boolean;
  refetchBalance: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload>({} as SessionPayload);
  const [currency, setCurrency] = useState<CurrencyType | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account>({} as Account);
  const [currentTab, setCurrentTab] = useState(graph_periods[0].value);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [balance, setBalance] = useState(0);

  const updateCurrency = (currency: CurrencyType) => {
    setCurrency(currency);
    secureLocalStorage.setItem('currency', JSON.stringify(currency));
  };

  const updateCurrentAccount = useCallback(async (account: Account) => {
    const queryClient = new QueryClient();
    await setActiveAccount(account.id);
    setCurrentAccount(account);
    secureLocalStorage.setItem('currentAccount', JSON.stringify(account));

    queryClient.invalidateQueries();
  }, []);

  const updateCurrentTab = (payload: string) => {
    setCurrentTab(payload);
  };

  const {
    data: accountsData,
    isLoading: isAccountLoading,
    refetch
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    refetchOnWindowFocus: true
  });

  const {
    data: walletsData,
    isLoading: isWalletLoading,
    refetch: refetchWalletsQuery
  } = useQuery({
    queryKey: ['wallets', currentAccount?.id],
    queryFn: () => getWallets(),
    enabled: !!currentAccount?.id
  });

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalanceQuery
  } = useQuery({
    queryKey: ['balance', currentAccount?.id],
    queryFn: () => getBalance(currentAccount?.id),
    refetchOnWindowFocus: true,
    enabled: !!currentAccount?.id
  });

  const refetchWallet = useCallback(() => {
    refetchWalletsQuery();
  }, [refetchWalletsQuery]);

  const refetchBalance = useCallback(() => {
    refetchBalanceQuery();
  }, [refetchBalanceQuery]);

  useEffect(() => {
    const storedCurrency = secureLocalStorage.getItem('currency');
    const storedAccounts = secureLocalStorage.getItem('accounts');
    const storedCurrentAccount = secureLocalStorage.getItem('currentAccount');

    if (storedCurrency && typeof storedCurrency === 'string') {
      try {
        setCurrency(JSON.parse(storedCurrency) as CurrencyType);
      } catch {
        setCurrency(currencies[0]);
      }
    } else {
      setCurrency(currencies[0]);
    }

    if (storedAccounts && typeof storedAccounts === 'string') {
      try {
        setAccounts(JSON.parse(storedAccounts) as Account[]);
      } catch {
        setAccounts([]);
      }
    }

    if (storedCurrentAccount && typeof storedCurrentAccount === 'string') {
      try {
        setCurrentAccount(JSON.parse(storedCurrentAccount) as Account);
      } catch {
        setCurrentAccount({} as Account);
      }
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

  useEffect(() => {
    if (walletsData?.data) {
      setWallets(walletsData.data);
    }
  }, [walletsData]);

  useEffect(() => {
    if (balanceData?.data) {
      setBalance(balanceData?.data?.balance_sats);
    }
  }, [balanceData]);

  useEffect(() => {
    if (accountsData?.data) {
      const fetchedAccounts: Account[] = accountsData.data;
      setAccounts(fetchedAccounts);

      secureLocalStorage.setItem('accounts', JSON.stringify(fetchedAccounts));
    }
  }, [accountsData, isAccountLoading, session, session?.activeAccount]);

  const refetchAccount = useCallback(() => {
    refetch();
  }, [refetch]);

  const values = useMemo(() => {
    return {
      currency,
      session,
      updateCurrency,
      accounts,
      currentAccount,
      isAccountLoading,
      updateCurrentAccount,
      refetchAccount,
      currentTab,
      updateCurrentTab,
      wallets,
      isWalletLoading,
      refetchWallet,
      isBalanceLoading,
      balance,
      refetchBalance
    };
  }, [
    currency,
    session,
    accounts,
    currentAccount,
    isAccountLoading,
    refetchAccount,
    currentTab,
    wallets,
    isWalletLoading,
    refetchWallet,
    updateCurrentAccount,
    isBalanceLoading,
    balance,
    refetchBalance
  ]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
