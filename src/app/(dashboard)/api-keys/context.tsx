'use client';

import { getAPIKeys } from './actions';
import { APIKey } from '@/types/api-keys';
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

interface APIKeysContextType {
  apiKeys: APIKey[];
  isAPIKeysLoading?: boolean;
  refetchAPIKeys: () => void;
}

const APIKeysContext = createContext<APIKeysContextType | undefined>(undefined);

export default function APIKeysContextProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isAPIKeysLoading
  } = useQuery({
    queryKey: ['api-keys', currentAccount?.id],
    queryFn: () => getAPIKeys(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchAPIKeys = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setAPIKeys(data?.data);
    } else {
      setAPIKeys([]);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      apiKeys,
      isAPIKeysLoading,
      refetchAPIKeys
    };
  }, [apiKeys, isAPIKeysLoading, refetchAPIKeys]);

  return <APIKeysContext.Provider value={values}>{children}</APIKeysContext.Provider>;
}

export const useAPIKeysContext = () => {
  const context = useContext(APIKeysContext);
  return context;
};
