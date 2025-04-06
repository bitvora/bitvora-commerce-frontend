'use client';

import { getCustomers } from './actions';
import { Customer } from '@/types/customers';
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

interface CustomerContextType {
  customers: Customer[];
  isCustomersLoading?: boolean;
  refetchCustomers: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export default function CustomerContextProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isCustomersLoading
  } = useQuery({
    queryKey: ['customers', currentAccount?.id],
    queryFn: () => getCustomers(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchCustomers = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setCustomers(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      customers,
      isCustomersLoading,
      refetchCustomers
    };
  }, [customers, isCustomersLoading, refetchCustomers]);

  return <CustomerContext.Provider value={values}>{children}</CustomerContext.Provider>;
}

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  return context;
};
