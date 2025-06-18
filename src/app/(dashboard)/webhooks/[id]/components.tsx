'use client';

import Table from '@/components/tables';
import { SemiboldSmallerText } from '@/components/Text';
import { formatDate, formatUUID, formatWebhookEvent } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getWebhookDeliveries } from './actions';
import { WebhookDelivery, WebhookDeliveryStatusType } from '@/types/webhooks';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { app_routes } from '@/lib/constants';

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

export const WebhookDeliveryStatus = ({ state }: { state: WebhookDeliveryStatusType }) => {
  let className = '';

  switch (state) {
    case 'successful':
      className = 'text-green-700';
      break;

    case 'pending':
      className = 'text-yellow-700';
      break;

    case 'failed':
      className = 'text-red-700';
      break;

    default:
      className = 'text-light-900';
      break;
  }

  return (
    <SemiboldSmallerText className={clsx('truncate capitalize', className)}>
      {state}
    </SemiboldSmallerText>
  );
};

export const WebhookDeliveries = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { id } = params;
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);

  const { data, isLoading: isWebhookDeliveriesLoading } = useQuery({
    queryKey: ['webhook-deliveries', id],
    queryFn: () => getWebhookDeliveries(id),
    enabled: !!id,
    refetchOnWindowFocus: 'always'
  });

  useEffect(() => {
    if (data?.data) {
      setDeliveries(data?.data);
    }
  }, [data]);

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <SemiboldSmallerText className="truncate text-light-700 hover:text-light-900">
          {formatUUID(row.id)}
        </SemiboldSmallerText>
      )
    },
    {
      header: 'Event',
      accessor: 'event_type',
      render: (row) => (
        <SemiboldSmallerText className="truncate text-light-700 hover:text-light-900">
          {formatWebhookEvent(row.event_type)}
        </SemiboldSmallerText>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <WebhookDeliveryStatus state={row.status} />
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (row) => (
        <SemiboldSmallerText className="truncate text-light-700 hover:text-light-900">
          {formatDate(row.created_at)}
        </SemiboldSmallerText>
      )
    }
  ];

  return (
    <div className="w-full mt-2 pt-2">
      <Table
        tableContainerClassName="products-subscription-table"
        columns={columns}
        data={deliveries as unknown as Record<string, unknown>[]}
        rowsPerPage={5}
        tableHeader={<></>}
        isLoading={isWebhookDeliveriesLoading}
        emptyMessage={'No Webhook deliveries'}
        rowOnClick={(row) => {
          router.push(`${app_routes.webhooks}/${id}/attempts/${row.id}`);
        }}
      />
    </div>
  );
};
