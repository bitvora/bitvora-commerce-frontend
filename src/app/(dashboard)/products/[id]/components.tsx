'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProductSubscription } from './actions';
import { Subscription, SubscriptionStatus } from '@/types/subscriptions';
import { useEffect, useState } from 'react';
import Table from '@/components/Table';
import { app_routes } from '@/lib/constants';
import { Link } from '@/components/Links';
import { MediumSmallerText, SemiboldSmallerText } from '@/components/Text';
import { formatDate, formatUUID } from '@/lib/helpers';
import clsx from 'clsx';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10 animate-pulse">
      <div className="flex w-full justify-between items-center animate-pulse">
        <div className="h-6 w-36 bg-light-300 rounded-md"></div>
        <div className="h-6 w-6 bg-light-300 rounded-full"></div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-[180px] h-[180px] bg-light-300 rounded-md"></div>

        <div className="flex flex-col gap-3 w-full">
          <div className="h-5 w-48 bg-light-300 rounded-md"></div>

          <div className="h-4 w-full bg-light-300 rounded-md"></div>

          <div className="h-4 w-3/4 bg-light-300 rounded-md"></div>

          <div className="h-5 w-24 bg-light-300 rounded-md"></div>

          <div className="h-4 w-32 bg-light-300 rounded-md"></div>

          <div className="h-4 w-36 bg-light-300 rounded-md"></div>
        </div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};

export const Subscribers = () => {
  const { id } = useParams<{ id: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['product-subscription', id],
    queryFn: () => getProductSubscription(id),
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
          'h-6 w-auto px-2 py-1 rounded-lg flex text-center justify-center items-center',
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
