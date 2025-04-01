'use client';

import { getSubscriptions } from './actions';
import { Subscription } from '@/types/subscriptions';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/app/contexts';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  isSubscriptionLoading?: boolean;
  refetchSubscriptions: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export default function SubscriptionContextProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isSubscriptionLoading
  } = useQuery({
    queryKey: ['subscriptions', currentAccount?.id],
    queryFn: () => getSubscriptions(),
    enabled: !!currentAccount?.id
  });

  const refetchSubscriptions = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setSubscriptions(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      subscriptions,
      isSubscriptionLoading,
      refetchSubscriptions
    };
  }, [subscriptions, isSubscriptionLoading, refetchSubscriptions]);

  return <SubscriptionContext.Provider value={values}>{children}</SubscriptionContext.Provider>;
}

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  return context;
};
