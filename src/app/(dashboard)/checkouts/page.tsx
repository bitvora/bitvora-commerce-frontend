'use client';

export const dynamic = 'force-dynamic';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { NewCheckout, CheckoutStatus } from './components';
import { useCheckoutContext } from './context';
import Table from '@/components/Table';
import { ViewIcon } from '@/components/Icons';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
export default function Page() {
  const { isCheckoutsLoading, checkouts } = useCheckoutContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.checkouts}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredCheckouts = useMemo(() => {
    if (!debouncedQuery) return checkouts;

    return checkouts.filter((checkout) =>
      Object.values(checkout).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [checkouts, debouncedQuery]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const clearQuery = () => {
    setQuery('');
    setCurrentPage(1);
  };

  const generateLink = (id: string) => `${app_routes.checkouts}/${id}`;

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={generateLink(row.id)} className="text-inherit">
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Link href={generateLink(row.id)} className="text-inherit">
          <SemiboldSmallText className="text-light-700 capitalize hover:text-light-900 truncate hidden md:flex">
            {row.type}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 capitalize hover:text-light-900">
            {row.type}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Status',
      accessor: 'state',
      render: (row) => <CheckoutStatus state={row.state} href={generateLink(row.id)} />
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (row) => (
        <Link href={generateLink(row.id)} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatDate(row.created_at)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.created_at)}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Expires At',
      accessor: 'expires_at',
      render: (row) => (
        <Link href={generateLink(row.id)} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatDate(row.expires_at)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.expires_at)}
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Checkouts</MediumHeader5>

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
              placeholder="Search Checkouts"
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
            <NewCheckout />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredCheckouts as unknown as Record<string, unknown>[]}
          rowsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          actionColumn={(row) => (
            <div className="flex gap-1 items-center">
              <Link href={`${app_routes.checkouts}/${row.id}`}>
                <button className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center border-none outline-none">
                  <ViewIcon />
                </button>
              </Link>
            </div>
          )}
          tableHeader={
            <div className="w-full hidden md:flex items-center justify-between">
              <SemiboldBody className="text-light-900">
                Checkouts <span className="text-light-700">({filteredCheckouts.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Checkouts"
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
          isLoading={isCheckoutsLoading}
          emptyMessage={query ? 'No Checkouts found' : 'No Checkouts'}
        />
      </div>
    </div>
  );
}
