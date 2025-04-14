'use client';

import { getPaymentLinks } from './actions';
import { PaymentLink } from '@/types/payment-links';
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

interface PaymentLinkContextType {
  paymentLinks: PaymentLink[];
  isPaymentLinksLoading?: boolean;
  refetchPaymentLinks: () => void;
}

const PaymentLinkContext = createContext<PaymentLinkContextType | undefined>(undefined);

export default function PaymentLinkContextProvider({ children }: { children: ReactNode }) {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isPaymentLinksLoading
  } = useQuery({
    queryKey: ['payment-links', currentAccount?.id],
    queryFn: () => getPaymentLinks(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchPaymentLinks = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setPaymentLinks(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      paymentLinks,
      isPaymentLinksLoading,
      refetchPaymentLinks
    };
  }, [paymentLinks, isPaymentLinksLoading, refetchPaymentLinks]);

  return <PaymentLinkContext.Provider value={values}>{children}</PaymentLinkContext.Provider>;
}

export const usePaymentLinkContext = () => {
  const context = useContext(PaymentLinkContext);
  return context;
};
