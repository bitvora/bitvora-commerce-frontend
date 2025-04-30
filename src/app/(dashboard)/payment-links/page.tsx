/* eslint-disable @next/next/no-img-element */
'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { AddPaymentLink, DeletePaymentLink, EditPaymentLink } from './components';
import { usePaymentLinkContext } from './context';
import Table from '@/components/Table';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID, renderPrice } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { PaymentLink } from '@/types/payment-links';
import { useProductContext } from '@/app/(dashboard)/products/context';

export default function Page() {
  const { paymentLinks, isPaymentLinksLoading } = usePaymentLinkContext();
  const { getProductById } = useProductContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentPaymentLink, setCurrentPaymentLink] = useState<PaymentLink>({} as PaymentLink);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentPaymentLink({} as PaymentLink);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.payment_links}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredPaymentLinks = useMemo(() => {
    if (!debouncedQuery) return paymentLinks;

    return paymentLinks.filter((paymentLink) =>
      Object.values(paymentLink).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [paymentLinks, debouncedQuery]);

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
        setCurrentPaymentLink({} as PaymentLink);
        router.replace(app_routes.payment_links);
      }
    },
    [router]
  );

  const handleEdit = (paymentLink) => {
    setCurrentPaymentLink(paymentLink);
    toggleEditModal(true);
  };

  const handleDelete = (paymentLink) => {
    setCurrentPaymentLink(paymentLink);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.payment_links}/${row.id}`}>
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <Link href={`${app_routes.payment_links}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {renderPrice({ amount: row.amount, currency: row.currency })}
          </SemiboldSmallText>

          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {renderPrice({ amount: row.amount, currency: row.currency })}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Product',
      accessor: 'product_id',
      render: (row) => {
        if (!row?.product_id?.trim()) {
          return (
            <div className="flex items-center gap-3">
              <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
                -
              </SemiboldSmallText>
              <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
                -
              </SemiboldSmallerText>
            </div>
          );
        }
        const product = getProductById(row.product_id);

        return (
          <div className="flex items-center gap-3">
            <button className="cursor-pointer border-none outline-none hidden md:flex">
              <img
                src={product?.image}
                alt={product?.name}
                className="w-10 h-10 rounded-md object-cover"
              />
            </button>

            <Link
              href={product?.product_link}
              target="_blank"
              referrerPolicy="same-origin"
              className="text-inherit">
              <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
                {product?.name}
              </SemiboldSmallText>
              <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
                {product?.name}
              </SemiboldSmallerText>
            </Link>
          </div>
        );
      }
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.payment_links}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatDate(row.created_at, 'MMM DD, YYYY')}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.created_at, 'MMM DD, YYYY')}
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Payment Links</MediumHeader5>

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
              placeholder="Search Payment Links"
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
            <AddPaymentLink />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredPaymentLinks as unknown as Record<string, unknown>[]}
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
                Payment Links{' '}
                <span className="text-light-700">({filteredPaymentLinks.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Payment Links"
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
          isLoading={isPaymentLinksLoading}
          emptyMessage={query ? 'No Payment Links found' : 'No Payment Links'}
        />
      </div>

      <EditPaymentLink
        isEditOpen={isEditOpen}
        paymentLink={currentPaymentLink}
        toggleEditModal={toggleEditModal}
      />

      <DeletePaymentLink
        paymentLink={currentPaymentLink}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
}
