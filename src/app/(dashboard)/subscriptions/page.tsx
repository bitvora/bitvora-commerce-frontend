'use client';

import Currency from '@/components/Currency';
import {
  MediumBody,
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { DeleteSubscriptionModal } from './components';
import { useSubscriptionContext } from './context';
import Table from '@/components/Table';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { Subscription } from '@/types/subscriptions';

export default function Page() {
  const { subscriptions, isSubscriptionLoading } = useSubscriptionContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({} as Subscription);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentSubscription({} as Subscription);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.subscriptions}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredSubscriptions = useMemo(() => {
    if (!debouncedQuery) return subscriptions;

    return subscriptions.filter((subscription) =>
      Object.values(subscription).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [subscriptions, debouncedQuery]);

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
        setCurrentSubscription({} as Subscription);
        router.replace(app_routes.subscriptions);
      }
    },
    [router]
  );

  const handleEdit = (subscription) => {
    setCurrentSubscription(subscription);
    toggleEditModal(true);
  };

  const handleDelete = (subscription) => {
    setCurrentSubscription(subscription);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Product',
      accessor: 'product_id',
      render: (row) => (
        <Link href={`${app_routes.products}/${row.product_id}`} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatUUID(row.product_id)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatUUID(row.product_id)}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Customer',
      accessor: 'customer_id',
      render: (row) => (
        <Link href={`${app_routes.customers}/${row.customer_id}`} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatUUID(row.customer_id)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatUUID(row.customer_id)}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Active On',
      accessor: 'active_on_date',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`}>
          <MediumBody className="text-light-700 hover:text-light-900">
            {formatDate(row.active_on_date, 'MMM DD, YYYY')}
          </MediumBody>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Subscriptions</MediumHeader5>

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
              placeholder="Search Subscriptions"
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

          <div>{/* <AddSubscription /> */}</div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredSubscriptions as unknown as Record<string, unknown>[]}
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
                Subscriptions{' '}
                <span className="text-light-700">({filteredSubscriptions.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Subscriptions"
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
          isLoading={isSubscriptionLoading}
          emptyMessage={query ? 'No Subscriptions found' : 'No Subscriptions'}
        />
      </div>

      {/* <EditSubscriptionModal
        isEditOpen={isEditOpen}
        subscription={currentSubscription}
        toggleEditModal={toggleEditModal}
      /> */}

      <DeleteSubscriptionModal
        subscription={currentSubscription}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
}
