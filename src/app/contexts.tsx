'use client';

import { fetchSession, getAccounts, getWallets } from '@/lib/actions';
import { currencies, graph_periods } from '@/lib/constants';
import { Account, CurrencyType, SessionPayload } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useQuery } from '@tanstack/react-query';
import { Wallet } from '@/types/wallets';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload>({} as SessionPayload);
  const [currency, setCurrency] = useState<CurrencyType | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account>({} as Account);
  const [currentTab, setCurrentTab] = useState(graph_periods[0].value);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  console.log({ session });
  const updateCurrency = (currency: CurrencyType) => {
    setCurrency(currency);
    secureLocalStorage.setItem('currency', JSON.stringify(currency));
  };

  const updateCurrentAccount = (account: Account) => {
    setCurrentAccount(account);
    secureLocalStorage.setItem('currentAccount', JSON.stringify(account));
  };

  const updateCurrentTab = (payload: string) => {
    setCurrentTab(payload);
  };

  const {
    data: accountsData,
    isLoading: isAccountLoading,
    refetch
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
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

  const refetchWallet = useCallback(() => {
    refetchWalletsQuery();
  }, [refetchWalletsQuery]);

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
    if (accountsData?.data) {
      const fetchedAccounts: Account[] = accountsData.data;
      setAccounts(fetchedAccounts);
      secureLocalStorage.setItem('accounts', JSON.stringify(fetchedAccounts));

      let selectedAccount = fetchedAccounts.find((acc) => acc.id === session?.activeAccount);

      if (!selectedAccount) {
        const storedAccount = secureLocalStorage.getItem('currentAccount');
        if (storedAccount && typeof storedAccount === 'string') {
          try {
            const parsedStoredAccount = JSON.parse(storedAccount) as Account;
            if (fetchedAccounts.some((acc) => acc.id === parsedStoredAccount.id)) {
              selectedAccount = parsedStoredAccount;
            }
          } catch {
            selectedAccount = fetchedAccounts[0];
          }
        } else {
          selectedAccount = fetchedAccounts[0];
        }
      }

      setCurrentAccount(selectedAccount);
      secureLocalStorage.setItem('currentAccount', JSON.stringify(selectedAccount));
    }
  }, [accountsData, isAccountLoading, session?.activeAccount]);

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
      refetchWallet
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
    refetchWallet
  ]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
