/* eslint-disable @next/next/no-img-element */
'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { AddProduct, DeleteProductModal, EditProduct, ProductImageModal } from './components';
import { useProductContext } from './context';
import Table from '@/components/Table';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { Product } from '@/lib/types';
import { renderPrice } from '@/lib/helpers';
import { Link } from '@/components/Links';

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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentProduct({} as Product);
    setIsDeleteOpen(false);
  };

  const closeImageModal = () => {
    setCurrentProduct({} as Product);
    setIsImageOpen(false);
  };

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
        router.replace(app_routes.products);
      }
    },
    [router]
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    toggleEditModal(true);
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            className="cursor-pointer border-none outline-none hidden md:flex"
            onClick={() => {
              setCurrentProduct(row);
              setIsImageOpen(true);
            }}>
            <img src={row.image} alt={row.name} className="w-10 h-10 rounded-md object-cover" />
          </button>

          <Link href={`${app_routes.products}/${row.id}`}>
            <SemiboldSmallText className="text-inherit truncate hidden md:flex">
              {row.name}
            </SemiboldSmallText>
            <SemiboldSmallerText className="truncate md:hidden text-light-700">
              {row.name}
            </SemiboldSmallerText>
          </Link>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'amount',
      render: (row) => (
        <Link href={`${app_routes.products}/${row.id}`}>
          <SemiboldSmallText className="text-inherit hidden md:flex">
            {renderPrice({ amount: row.amount, currency: row.currency })}
          </SemiboldSmallText>

          <SemiboldSmallerText className="truncate md:hidden text-light-700">
            {renderPrice({ amount: row.amount, currency: row.currency })}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Sales',
      accessor: 'total_sales',
      render: (row) => (
        <Link href={`${app_routes.products}/${row.id}`}>
          <SemiboldSmallText className="text-inherit hidden md:flex">N/A</SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700">
            N/A
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Subscriptions',
      accessor: 'subscriptions',
      render: (row) => (
        <Link href={`${app_routes.products}/${row.id}`}>
          <SemiboldSmallText className="text-inherit hidden md:flex">N/A</SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700">
            N/A
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Products</MediumHeader5>

          <div className="hidden md:flex">
            <Currency />
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-[auto] justify-between">
          <div className="sm:hidden">
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

          <div>
            <AddProduct />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredProducts as unknown as Record<string, unknown>[]}
          rowsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actionColumn={(row) => (
            <div className="flex gap-1 items-center">
              <button
                onClick={() => handleEdit(row)}
                className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center border-none outline-none">
                <EditIcon />
              </button>

              <button
                onClick={() => handleDelete(row)}
                className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center border-none outline-none">
                <DeleteIcon />
              </button>
            </div>
          )}
          tableHeader={
            <div className="w-full hidden md:flex items-center justify-between">
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

      <DeleteProductModal
        product={currentProduct}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />

      <ProductImageModal
        product={currentProduct}
        isImageOpen={isImageOpen}
        closeImageModal={closeImageModal}
      />
    </div>
  );
}
