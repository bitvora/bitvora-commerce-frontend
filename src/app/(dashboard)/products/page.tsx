/* eslint-disable @next/next/no-img-element */
'use client';

import Currency from '@/components/Currency';
import { MediumHeader5, SemiboldBody, SemiboldSmallText } from '@/components/Text';
import { AddProduct, EditProduct } from './components';
import { useProductContext } from './context';
import Table from '@/components/Table';
import numeral from 'numeral';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { Product } from '@/lib/types';

const renderPrice = ({ amount, currency }: { amount: number; currency: string }) => {
  let price;

  switch (currency) {
    case 'sats':
      price = `${numeral(amount).format('0,0')} sats`;
      break;

    case 'btc':
      price = `${numeral(amount).format('0,0.0000000')} btc`;
      break;

    case 'eur':
      price = `€ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'gbp':
      price = `£ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'jpy':
      price = `¥ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'cad':
      price = `CA$ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'aud':
      price = `AU$ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'cny':
      price = `CN¥ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'eth':
      price = `${numeral(amount).format('0,0.0000000')} eth`;
      break;

    case 'usd':
    default:
      price = `$ ${numeral(amount).format('0,0.00')}`;
  }
  return <SemiboldSmallText className="text-light-700">{price}</SemiboldSmallText>;
};

const columns = [
  { header: 'ID', accessor: 'id' },
  {
    header: 'Name',
    accessor: 'name',
    render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.image} alt={row.name} className="w-10 h-10 rounded-md object-cover" />
        <SemiboldSmallText className="text-light-700 truncate">{row.name}</SemiboldSmallText>
      </div>
    )
  },
  {
    header: 'Price',
    accessor: 'amount',
    render: (row) => renderPrice({ amount: row.amount, currency: row.currency })
  },
  {
    header: 'Total Sales',
    accessor: 'total_sales',
    render: () => <SemiboldSmallText className="text-light-700">N/A</SemiboldSmallText>
  },
  {
    header: 'Subscriptions',
    accessor: 'subscriptions',
    render: () => <SemiboldSmallText className="text-light-700">N/A</SemiboldSmallText>
  }
];

export default function Page() {
  const { products, isProductsLoading } = useProductContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentProduct, setCurrentProduct] = useState<Product>({} as Product);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.products}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return products;

    return products.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [products, debouncedQuery]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const clearQuery = () => {
    setQuery('');
    setCurrentPage(1);
  };

  const toggleEditModal = useCallback(
    (value: boolean) => {
      setIsEditOpen(value);

      if (!value) {
        setCurrentProduct({} as Product);
      }
    },
    [setIsEditOpen, setCurrentProduct]
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    toggleEditModal(true);
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
  };

  return (
    <div className="flex flex-col gap-8 bg-primary-150 px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-2 lg:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="gap-10 items-center hidden xl:flex">
          <MediumHeader5>Products</MediumHeader5>

          <div className="hidden lg:flex">
            <Currency />
          </div>
        </div>

        <div className="flex gap-4 items-center w-full xl:w-[auto]">
          <AddProduct />
        </div>
      </div>

      <div className="w-full">
        <Table
          columns={columns}
          data={filteredProducts as unknown as Record<string, unknown>[]}
          rowsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actionColumn={(row) => (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleEdit(row)}
                className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center">
                <EditIcon />
              </button>

              <button
                onClick={() => handleDelete(row)}
                className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center">
                <DeleteIcon />
              </button>
            </div>
          )}
          tableHeader={
            <div className="w-full flex items-center justify-between">
              <SemiboldBody className="text-light-900">
                Products <span className="text-light-700">({filteredProducts.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Products"
                startIcon={
                  <div className="text-light-500">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                }
                endIcon={
                  query && (
                    <button
                      className="cursor-pointer z-10 text-light-700 hover:text-light-900 outline-none border-none"
                      onClick={clearQuery}>
                      <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                    </button>
                  )
                }
                className="h-10"
              />
            </div>
          }
          isLoading={isProductsLoading}
          emptyMessage={query ? 'No Products found' : 'No Products'}
        />
      </div>

      <EditProduct
        isEditOpen={isEditOpen}
        product={currentProduct}
        toggleEditModal={toggleEditModal}
      />
    </div>
  );
}
