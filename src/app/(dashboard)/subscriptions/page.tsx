/* eslint-disable @next/next/no-img-element */
'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import {
  DeleteSubscriptionModal,
  AddSubscription
  // , EditSubscription
} from './components';
import { useSubscriptionContext } from './context';
import Table from '@/components/Table';
import {
  DeleteIcon
  // ,EditIcon
} from '@/components/Icons';
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState
  // ,useCallback,
} from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { Subscription } from '@/types/subscriptions';
import { useProductContext } from '@/app/(dashboard)/products/context';
import { useCustomerContext } from '@/app/(dashboard)/customers/context';

export default function Page() {
  const { subscriptions, isSubscriptionLoading } = useSubscriptionContext();
  const { getProductById } = useProductContext();
  const { getCustomerById } = useCustomerContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({} as Subscription);

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
      render: (row) => {
        const product = getProductById(row.product_id);

        return (
          <div className="flex items-center gap-3">
            <button className="cursor-pointer border-none outline-none hidden md:flex">
              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
            </button>

            <Link
              href={product.product_link}
              target="_blank"
              referrerPolicy="same-origin"
              className="text-inherit">
              <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
                {product.name}
              </SemiboldSmallText>
              <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
                {product.name}
              </SemiboldSmallerText>
            </Link>
          </div>
        );
      }
    },
    {
      header: 'Customer',
      accessor: 'customer_id',
      render: (row) => {
        const customer = getCustomerById(row.customer_id);
        return (
          <Link
            href={customer.customer_link}
            className="text-inherit"
            target="_blank"
            referrerPolicy="same-origin">
            <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
              {customer.name}
            </SemiboldSmallText>
            <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
              {customer.name}
            </SemiboldSmallerText>
          </Link>
        );
      }
    },
    {
      header: 'Active On',
      accessor: 'active_on_date',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {formatDate(row.active_on_date, 'MMM DD, YYYY')}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.active_on_date, 'MMM DD, YYYY')}
          </SemiboldSmallerText>
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

          <div>
            <AddSubscription />
          </div>
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

      {/* <EditSubscription
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
