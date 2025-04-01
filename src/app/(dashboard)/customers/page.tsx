'use client';

import Currency from '@/components/Currency';
import {
  MediumHeader5,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { AddCustomer, DeleteCustomerModal, EditCustomer } from './components';
import { useCustomerContext } from './context';
import Table from '@/components/Table';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { Customer } from '@/types/customers';

export default function Page() {
  const { isCustomersLoading, customers } = useCustomerContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentCustomer, setCurrentCustomer] = useState<Customer>({} as Customer);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setCurrentCustomer({} as Customer);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.customers}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredCustomers = useMemo(() => {
    if (!debouncedQuery) return customers;

    return customers.filter((customer) =>
      Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [customers, debouncedQuery]);

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
        setCurrentCustomer({} as Customer);
        router.replace(app_routes.customers);
      }
    },
    [router]
  );

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    toggleEditModal(true);
  };

  const handleDelete = (customer) => {
    setCurrentCustomer(customer);
    setIsDeleteOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.customers}/${row.id}`} className="text-inherit">
          <SemiboldSmallerText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <Link href={`${app_routes.customers}/${row.id}`} className="text-inherit">
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
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <Link href={`${app_routes.customers}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {row.email}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.email}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Phone',
      accessor: 'phone_number',
      render: (row) => (
        <Link href={`${app_routes.customers}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="text-light-700 hover:text-light-900 truncate hidden md:flex">
            {row.phone_number}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.phone_number}
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Customers</MediumHeader5>

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
              placeholder="Search Customers"
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
            <AddCustomer />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredCustomers as unknown as Record<string, unknown>[]}
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
                Customers <span className="text-light-700">({filteredCustomers.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Customers"
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
          isLoading={isCustomersLoading}
          emptyMessage={query ? 'No Customers found' : 'No Customers'}
        />
      </div>

      <EditCustomer
        customer={currentCustomer}
        toggleEditModal={toggleEditModal}
        isEditOpen={isEditOpen}
      />

      <DeleteCustomerModal
        customer={currentCustomer}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
}
