'use client';

import { app_routes } from '@/lib/constants';
import { getCustomer } from './actions';
import { Customer } from '@/types/customers';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Drawer from 'react-modern-drawer';
import { SemiboldBody, SemiboldTitle } from '@/components/Text';
import { Link } from '@/components/Links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Accordion from '@/components/Accordion';
import { CustomerDetailsItem, Skeleton } from './components';
import { countNonEmptyFields, formatDate } from '@/lib/helpers';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import { DeleteCustomerModal, EditCustomer } from '@/app/(dashboard)/customers/components';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id),
    enabled: !!id
  });

  useEffect(() => {
    if (data?.data) {
      setCustomer(data?.data);
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

  const customerStats = countNonEmptyFields(customer as unknown as Record<string, unknown>, [
    'name',
    'email',
    'description',
    'phone_number',
    'currency'
  ]);

  const billingAddressStats = countNonEmptyFields(customer as unknown as Record<string, unknown>, [
    'billing_address_line1',
    'billing_address_line2',
    'billing_city',
    'billing_state',
    'billing_postal_code',
    'billing_country'
  ]);

  const shippingAddressStats = countNonEmptyFields(customer as unknown as Record<string, unknown>, [
    'shipping_address_line1',
    'shipping_address_line2',
    'shipping_city',
    'shipping_state',
    'shipping_postal_code',
    'shipping_country'
  ]);

  return (
    <>
      <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">Customer Details</SemiboldTitle>

              <Link href={app_routes.customers}>
                <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                  <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
                </button>
              </Link>
            </div>

            <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full h-full overflow-auto">
              <Accordion
                contentClassName="w-full mt-2 pt-2"
                triggerClassName=""
                containerClassName="mb-5 pb-2 border-b-[0.5px] border-light-300"
                items={[
                  {
                    label: (
                      <div className="w-full justify-start text-start">
                        <SemiboldBody className="text-light-900">
                          Customer Details{' '}
                          <span className="text-light-700">
                            {customerStats?.nonEmptyFields}/{customerStats?.totalFields}
                          </span>
                        </SemiboldBody>
                      </div>
                    ),
                    content: (
                      <div className="flex flex-col gap-5 px-2 mb-2 relative">
                        <CustomerDetailsItem label="Customer Name" value={customer?.name} />
                        <CustomerDetailsItem label="Customer Email" value={customer?.email} />
                        <CustomerDetailsItem label="Description" value={customer?.description} />
                        <CustomerDetailsItem label="Phone Number" value={customer?.phone_number} />
                        <CustomerDetailsItem
                          label="Currency"
                          value={customer?.currency?.toUpperCase()}
                        />
                        <CustomerDetailsItem
                          label="Created On"
                          value={formatDate(customer?.created_at)}
                        />
                      </div>
                    )
                  },
                  {
                    label: (
                      <div className="w-full justify-start text-start">
                        <SemiboldBody className="text-light-900">
                          Billing Address{' '}
                          <span className="text-light-700">
                            {billingAddressStats?.nonEmptyFields}/{billingAddressStats?.totalFields}
                          </span>
                        </SemiboldBody>
                      </div>
                    ),
                    content: (
                      <div className="flex flex-col gap-5 px-2 mb-2 relative">
                        <CustomerDetailsItem
                          label="Billing Address Line 1"
                          value={customer?.billing_address_line1}
                        />
                        <CustomerDetailsItem
                          label="Billing Address Line 2"
                          value={customer?.billing_address_line2}
                        />
                        <CustomerDetailsItem label="City" value={customer?.billing_city} />
                        <CustomerDetailsItem label="State" value={customer?.billing_state} />
                        <CustomerDetailsItem
                          label="Postal Code"
                          value={customer?.billing_postal_code}
                        />
                        <CustomerDetailsItem label="Country" value={customer?.billing_country} />
                      </div>
                    )
                  },
                  {
                    label: (
                      <div className="w-full justify-start text-start">
                        <SemiboldBody className="text-light-900">
                          Shipping Address{' '}
                          <span className="text-light-700">
                            {shippingAddressStats?.nonEmptyFields}/
                            {shippingAddressStats?.totalFields}
                          </span>
                        </SemiboldBody>
                      </div>
                    ),
                    content: (
                      <div className="flex flex-col gap-5 px-2 mb-2 relative">
                        <CustomerDetailsItem
                          label="Shipping Address Line 1"
                          value={customer?.shipping_address_line1}
                        />
                        <CustomerDetailsItem
                          label="Shipping Address Line 2"
                          value={customer?.shipping_address_line2}
                        />
                        <CustomerDetailsItem label="City" value={customer?.shipping_city} />
                        <CustomerDetailsItem label="State" value={customer?.shipping_state} />
                        <CustomerDetailsItem
                          label="Postal Code"
                          value={customer?.shipping_postal_code}
                        />
                        <CustomerDetailsItem label="Country" value={customer?.shipping_country} />
                      </div>
                    )
                  }
                ]}
              />
            </div>

            <div className="w-full flex gap-4 items-center border-none outline-none">
              <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
                Edit Customer
              </SecondaryButton>

              <RedButton
                className="h-11 w-full border-none outline-none"
                onClick={() => setIsDeleteOpen(true)}>
                Delete Customer
              </RedButton>
            </div>
          </div>
        )}
      </Drawer>

      <EditCustomer customer={customer} toggleEditModal={toggleEditModal} isEditOpen={isEditOpen} />

      <DeleteCustomerModal
        customer={customer}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </>
  );
}
