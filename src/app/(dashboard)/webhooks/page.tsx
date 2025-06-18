'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { CreateWebhook, DeleteWebhook, EditWebhook } from './components';
import { useWebhookContext } from './context';
import Table from '@/components/tables';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { Webhook } from '@/types/webhooks';
import clsx from 'clsx';

export default function Page() {
  const { webhooks, isWebhooksLoading } = useWebhookContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentWebhook, setCurrentWebhook] = useState<Webhook>({} as Webhook);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentWebhook({} as Webhook);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.webhooks}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredWebhooks = useMemo(() => {
    if (!debouncedQuery) return webhooks;

    return webhooks.filter((webhook) =>
      Object.values(webhook).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [webhooks, debouncedQuery]);

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
        setCurrentWebhook({} as Webhook);
        router.replace(app_routes.webhooks);
      }
    },
    [router]
  );

  const handleEdit = (webhook) => {
    setCurrentWebhook(webhook);
    toggleEditModal(true);
  };

  const handleDelete = (webhook) => {
    setCurrentWebhook(webhook);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.webhooks}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'URL',
      accessor: 'url',
      render: (row) => (
        <Link href={`${app_routes.webhooks}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {row.url}
          </SemiboldSmallText>

          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.url}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Events',
      accessor: 'events',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {row.events?.length}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.events?.length}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Status',
      accessor: 'enabled',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText
            className={clsx('hidden md:flex', {
              'text-red-700 hover:text-red-900': !row.enabled,
              'text-green-500 hover:text-green-700': row.enabled
            })}>
            {row.enabled ? 'Enabled' : 'Disabled'}
          </SemiboldSmallText>
          <SemiboldSmallerText
            className={clsx('md:hidden', {
              'text-red-700 hover:text-red-900': !row.enabled,
              'text-green-500 hover:text-green-700': row.enabled
            })}>
            {row.enabled ? 'Enabled' : 'Disabled'}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {formatDate(row.created_at)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.created_at)}
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5 className="text-light-900">Webhooks</MediumHeader5>

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
              placeholder="Search Webhooks"
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
            <CreateWebhook />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredWebhooks as unknown as Record<string, unknown>[]}
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
                Webhooks <span className="text-light-700">({filteredWebhooks.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Webhooks"
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
          isLoading={isWebhooksLoading}
          emptyMessage={query ? 'No Webhooks found' : 'No Webhooks'}
        />
      </div>

      <EditWebhook
        isEditOpen={isEditOpen}
        webhook={currentWebhook}
        toggleEditModal={toggleEditModal}
      />

      <DeleteWebhook
        webhook={currentWebhook}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
}
