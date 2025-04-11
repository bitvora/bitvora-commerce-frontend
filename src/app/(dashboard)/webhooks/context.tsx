'use client';

import { getWebhooks } from './actions';
import { Webhook } from '@/types/webhooks';
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

interface WebhookContextType {
  webhooks: Webhook[];
  isWebhooksLoading?: boolean;
  refetchWebhooks: () => void;
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export default function WebhookContextProvider({ children }: { children: ReactNode }) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isWebhooksLoading
  } = useQuery({
    queryKey: ['webhooks', currentAccount?.id],
    queryFn: () => getWebhooks(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchWebhooks = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setWebhooks(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      webhooks,
      isWebhooksLoading,
      refetchWebhooks
    };
  }, [webhooks, isWebhooksLoading, refetchWebhooks]);

  return <WebhookContext.Provider value={values}>{children}</WebhookContext.Provider>;
}

export const useWebhookContext = () => {
  const context = useContext(WebhookContext);
  return context;
};
