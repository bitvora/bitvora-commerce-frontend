'use client';

import { app_routes } from '@/lib/constants';
import { getWebhookDeliveries } from '../../actions';
import { WebhookDelivery } from '@/types/webhooks';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Drawer from 'react-modern-drawer';
import { SemiboldBody, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Skeleton, WebhookAttemptDetails, WebhookDeliveryStatus } from './components';

import { PrettyJson } from '@/components/PrettyJSON';
import Tabs from '@/components/Tab';
import { formatDate, formatWebhookEvent } from '@/lib/helpers';

type Params = Promise<{ id: string; attempt_id: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;
  const attempt_id = params.attempt_id;

  const router = useRouter();

  const [attempt, setAttempt] = useState<WebhookDelivery>({} as WebhookDelivery);

  const { data, isLoading: isWebhookDeliveriesLoading } = useQuery({
    queryKey: ['webhook-deliveries', id],
    queryFn: () => getWebhookDeliveries(id),
    enabled: !!id,
    refetchOnWindowFocus: 'always'
  });

  useEffect(() => {
    if (data?.data) {
      const attempt = data?.data.find((attempt) => attempt.id === attempt_id);
      console.log(JSON.stringify(attempt));
      setAttempt(attempt);
    }
  }, [attempt_id, data]);

  const handleClose = () => {
    router.push(app_routes.webhooks);
  };

  return (
    <>
      <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
        {isWebhookDeliveriesLoading ? (
          <Skeleton />
        ) : (
          <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">Webhook Attempt Details</SemiboldTitle>

              <button
                className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700"
                onClick={() => {
                  router.back();
                }}>
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="flex w-full flex-col gap-8">
              <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full overflow-auto flex flex-col gap-6">
                <WebhookAttemptDetails
                  label="Webhook ID"
                  value={attempt?.webhook_id}
                  id={true}
                  url={`${app_routes.webhooks}/${attempt?.webhook_id}`}
                />

                <WebhookAttemptDetails
                  label="Event Type"
                  value={formatWebhookEvent(attempt?.event_type)}
                />

                <WebhookAttemptDetails label="Duration" value={`${attempt?.duration_ms} ms`} />

                <WebhookDeliveryStatus state={attempt?.status} />
                {attempt?.error_message && (
                  <WebhookAttemptDetails
                    label="Error Message"
                    value={attempt?.error_message}
                    error
                  />
                )}

                <WebhookAttemptDetails label="Date" value={formatDate(attempt?.created_at)} />
              </div>

              <div className="w-full rounded-lg px-3 md:px-4 py-3 md:py-4">
                <Tabs
                  tabs={[
                    {
                      label: 'Request',
                      content: (
                        <div className="w-full mt-3 pt-3">
                          {attempt?.request_payload ? (
                            <PrettyJson data={attempt?.request_payload} />
                          ) : (
                            <SemiboldBody className="text-light-900">No Request body</SemiboldBody>
                          )}
                        </div>
                      )
                    },
                    {
                      label: 'Response',
                      content: (
                        <div className="w-full mt-3 pt-3">
                          {attempt?.response_body ? (
                            <PrettyJson data={attempt?.response_body} />
                          ) : (
                            <SemiboldBody className="text-light-900">No Response body</SemiboldBody>
                          )}
                        </div>
                      )
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
