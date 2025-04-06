'use client';

import { getProducts } from './actions';
import { Product } from '@/lib/types';
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

interface ProductContextType {
  products: Product[];
  isProductsLoading?: boolean;
  refetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default function ProductContextProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { currentAccount } = useAppContext();

  const {
    data,
    refetch,
    isLoading: isProductsLoading
  } = useQuery({
    queryKey: ['products', currentAccount?.id],
    queryFn: () => getProducts(),
    enabled: !!currentAccount?.id,
    refetchOnWindowFocus: 'always'
  });

  const refetchProducts = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.data) {
      setProducts(data?.data);
    }
  }, [data]);

  const values = useMemo(() => {
    return {
      products,
      isProductsLoading,
      refetchProducts
    };
  }, [products, isProductsLoading, refetchProducts]);

  return <ProductContext.Provider value={values}>{children}</ProductContext.Provider>;
}

export const useProductContext = () => {
  const context = useContext(ProductContext);
  return context;
};
