'use client';

import { getCustomerSubscription } from './actions';
import { Link } from '@/components/Links';
import Table from '@/components/tables';
import { MediumBody, MediumSmallerText, SemiboldBody, SemiboldSmallerText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { copyToClipboard, formatDate, formatUUID } from '@/lib/helpers';
import { Subscription, SubscriptionStatus } from '@/types/subscriptions';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-150 gap-10 animate-pulse">
      <div className="flex w-full justify-between items-center animate-pulse">
        <div className="h-6 w-36 bg-light-300 rounded-md"></div>
        <div className="h-6 w-6 bg-light-300 rounded-full"></div>
      </div>

      <div className="h-[500px] w-full bg-light-300 rounded-md"></div>
    </div>
  );
};

export const CustomerDetailsItem = ({
  label,
  value,
  id
}: {
  label: string;
  value: string;
  id?: boolean;
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      <div className="w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex items-center gap-2">
        <SemiboldBody className="text-light-900">{id ? formatUUID(value) : value}</SemiboldBody>
        {id && (
          <button
            className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
            onClick={() => copyToClipboard({ text: value })}>
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </div>
    </div>
  );
};

export const Subscriptions = () => {
  const { id } = useParams<{ id: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['customer-subscription', id],
    queryFn: () => getCustomerSubscription(id),
    enabled: !!id
  });

  useEffect(() => {
    if (data?.data) {
      setSubscriptions(data?.data);
      setLoading(false);
    }
  }, [data]);

  const renderStatus = (status: SubscriptionStatus) => {
    let className = '';

    switch (status) {
      case 'suspended':
        className = `${className} bg-secondary-50 text-secondary-500`;
        break;

      case 'cancelled':
        className = `${className} bg-red-50 text-red-500`;
        break;

      case 'active':
        className = `${className} bg-green-50 text-green-500`;
        break;

      default:
    }

    return (
      <div
        className={clsx(
          'h-6 w-fit px-4 py-1.5 rounded-lg flex text-center justify-center items-center',
          className
        )}>
        <SemiboldSmallerText className="text-inherit capitalize">{status}</SemiboldSmallerText>
      </div>
    );
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`}>
          <MediumSmallerText className="text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </MediumSmallerText>
        </Link>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`}>{renderStatus(row.status)}</Link>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.subscriptions}/${row.id}`}>
          <MediumSmallerText className="text-light-700 hover:text-light-900">
            {formatDate(row.created_at, 'MMM DD, YYYY')}
          </MediumSmallerText>
        </Link>
      )
    }
  ];

  return (
    <div className="w-full mt-2">
      <Table
        tableContainerClassName="products-subscription-table"
        columns={columns}
        data={subscriptions}
        rowsPerPage={5}
        isLoading={loading}
        emptyMessage="No Subscriptions"
      />
    </div>
  );
};
