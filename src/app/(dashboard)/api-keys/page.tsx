'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { CreateAPIKey, DeleteAPIKey, EditAPIKey } from './components';
import { useAPIKeysContext } from './context';
import Table from '@/components/tables';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { Link } from '@/components/Links';
import { APIKey } from '@/types/api-keys';
import { countTruePermissions, formatDate } from '@/lib/helpers';

export default function Page() {
  const { apiKeys, isAPIKeysLoading } = useAPIKeysContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentAPIKey, setCurrentAPIKey] = useState<APIKey>({} as APIKey);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentAPIKey({} as APIKey);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.api_keys}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredAPIKeys = useMemo(() => {
    if (!debouncedQuery) return apiKeys;

    return apiKeys.filter((api_key) =>
      Object.values(api_key).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [apiKeys, debouncedQuery]);

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
        setCurrentAPIKey({} as APIKey);
        router.replace(app_routes.api_keys);
      }
    },
    [router]
  );

  const handleEdit = (api_key) => {
    setCurrentAPIKey(api_key);
    toggleEditModal(true);
  };

  const handleDelete = (api_key) => {
    setCurrentAPIKey(api_key);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.api_keys}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {row.id}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <Link href={`${app_routes.api_keys}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {row.name}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.name}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Permissions',
      accessor: 'permissions',
      render: (row) => (
        <Link href={`${app_routes.api_keys}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {countTruePermissions(row.permissions)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {countTruePermissions(row.permissions)}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.api_keys}/${row.id}`}>
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
          <MediumHeader5 className="text-light-900">API Keys</MediumHeader5>

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
              placeholder="Search API Keys"
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
            <CreateAPIKey />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredAPIKeys as unknown as Record<string, unknown>[]}
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
                API Keys <span className="text-light-700">({filteredAPIKeys.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search API Keys"
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
          isLoading={isAPIKeysLoading}
          emptyMessage={query ? 'No API Keys found' : 'No API Keys'}
        />
      </div>

      <EditAPIKey
        isEditOpen={isEditOpen}
        apiKey={currentAPIKey}
        toggleEditModal={toggleEditModal}
      />

      <DeleteAPIKey
        apiKey={currentAPIKey}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
}
