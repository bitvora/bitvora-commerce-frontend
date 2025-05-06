'use client';

import { getCheckouts } from './actions';
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
import { useAppContext } from '@/contexts';
import { Checkout } from '@/types/checkout';

interface CheckoutContextType {
  checkouts: Checkout[];
  isCheckoutsLoading?: boolean;
  refetchCheckouts: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export default function CheckoutContextProvider({ children }: { children: ReactNode }) {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isCheckoutsLoading
  } = useQuery({
    queryKey: ['checkouts', currentAccount?.id],
    queryFn: () => getCheckouts(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchCheckouts = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setCheckouts(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      checkouts,
      isCheckoutsLoading,
      refetchCheckouts
    };
  }, [checkouts, isCheckoutsLoading, refetchCheckouts]);

  return <CheckoutContext.Provider value={values}>{children}</CheckoutContext.Provider>;
}

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  return context;
};
