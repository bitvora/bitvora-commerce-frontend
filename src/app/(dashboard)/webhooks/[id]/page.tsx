'use client';

import { app_routes, webhook_events } from '@/lib/constants';
import { getWebhook } from './actions';
import { Webhook } from '@/types/webhooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Drawer from 'react-modern-drawer';
import { SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Skeleton, WebhookDeliveries } from './components';

import { useParams } from 'next/navigation';
import { ReadonlyInput } from '@/components/Inputs';
import Tabs from '@/components/Tab';
import clsx from 'clsx';
import { formatWebhookEvent } from '@/lib/helpers';

export default function Page() {
  const params = useParams<{ id: string }>();

  const { id } = params;

  const router = useRouter();

  const [webhook, setWebhook] = useState<Webhook>({} as Webhook);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['webhook', id],
    queryFn: () => getWebhook(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (data?.data) {
      setWebhook(data?.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.webhooks);
  };

  return (
    <>
      <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">Webhook Details</SemiboldTitle>

              <button
                className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700"
                onClick={() => {
                  router.back();
                }}>
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                <ReadonlyInput label="URL" value={webhook?.url} />
              </div>

              <div className="mt-2 pt-2">
                <Tabs
                  tabs={[
                    {
                      label: 'Events',
                      content: (
                        <div className="flex flex-col gap-5 px-2 mb-2 relative mt-2 pt-2">
                          {webhook_events.map((event) => {
                            const isPresent = webhook?.events.includes(event);
                            return (
                              <div
                                className={clsx('flex items-center gap-2', {
                                  'text-green-700': isPresent,
                                  'text-red-700': !isPresent
                                })}
                                key={event}>
                                <SemiboldSmallText className="text-light-900 capitalize">
                                  {formatWebhookEvent(event)}
                                </SemiboldSmallText>
                                <FontAwesomeIcon
                                  icon={isPresent ? faCheck : faXmark}
                                  className="text-inherit w-8 h-8"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )
                    },
                    {
                      label: 'Deliveries',
                      content: <WebhookDeliveries />
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
