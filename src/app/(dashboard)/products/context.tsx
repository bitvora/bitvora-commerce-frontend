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
import { useAppContext } from '@/contexts';
import { generateProductLink } from '@/lib/helpers';

interface ProductContextType {
  products: Product[];
  isProductsLoading?: boolean;
  refetchProducts: () => void;
  getProductById: (id: string) => Product;
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
      const products: Product[] = data?.data;
      setProducts(
        products.map((product) => {
          return {
            ...product,
            product_link: generateProductLink(product.id)
          };
        })
      );
    }
  }, [data]);

  const getProductById = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products]
  );

  const values = useMemo(() => {
    return {
      products,
      isProductsLoading,
      refetchProducts,
      getProductById
    };
  }, [products, isProductsLoading, refetchProducts, getProductById]);

  return <ProductContext.Provider value={values}>{children}</ProductContext.Provider>;
}

export const useProductContext = () => {
  const context = useContext(ProductContext);
  return context;
};
