'use client';

import { app_routes } from '@/lib/constants';
import { getSubscription } from './actions';
import { Subscription } from '@/types/subscriptions';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Drawer from 'react-modern-drawer';
import { SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionDetailsItem, Skeleton } from './components';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import { formatDate } from '@/lib/helpers';
import { DeleteSubscriptionModal } from '@/app/(dashboard)/subscriptions/components';
// import { DeleteCustomerModal, EditCustomer } from './components';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams<{ id: string }>();

  const { id } = params;

  const router = useRouter();

  const [subscription, setSubscription] = useState<Subscription>({} as Subscription);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['subscription', id],
    queryFn: () => getSubscription(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (data?.data) {
      setSubscription(data?.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.products);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const toggleEditModal = useCallback((value: boolean) => {
    setIsEditOpen(value);
  }, []);

  return (
    <>
      <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">Subscription Details</SemiboldTitle>

              <button
                className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700"
                onClick={() => {
                  router.back();
                }}>
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full overflow-auto flex flex-col gap-6">
              <SubscriptionDetailsItem label="Subscription ID" value={subscription?.id} id={true} />

              <SubscriptionDetailsItem
                label="Customer ID"
                value={subscription?.customer_id}
                url={`${app_routes.customers}/${subscription?.customer_id}`}
                id={true}
              />

              <SubscriptionDetailsItem
                label="Product ID"
                value={subscription?.product_id}
                url={`${app_routes.products}/${subscription?.product_id}`}
                id={true}
              />

              <SubscriptionDetailsItem
                label="Billing Start Date"
                value={formatDate(subscription?.billing_start_date, 'MMM DD, YYYY')}
              />

              <SubscriptionDetailsItem
                label="Active On Date"
                value={formatDate(subscription?.active_on_date, 'MMM DD, YYYY')}
              />

              <SubscriptionDetailsItem
                label="Nostr Public Relay"
                value={subscription?.nostr_relay}
              />

              <SubscriptionDetailsItem
                label="Created On"
                value={formatDate(subscription?.created_at)}
              />
            </div>

            <div className="w-full flex gap-4 items-center border-none outline-none">
              <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
                Edit Subscription
              </SecondaryButton>

              <RedButton
                className="h-11 w-full border-none outline-none"
                onClick={() => setIsDeleteOpen(true)}>
                Delete Subscription
              </RedButton>
            </div>
          </div>
        )}
      </Drawer>

      {/* <EditCustomer customer={customer} toggleEditModal={toggleEditModal} isEditOpen={isEditOpen} />*/}

      <DeleteSubscriptionModal
        subscription={subscription}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </>
  );
}
