/* eslint-disable @next/next/no-img-element */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProduct } from './actions';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes, billing_period_hours } from '@/lib/constants';
import {
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText,
  SemiboldTitle
} from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatDate, renderPrice } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { Skeleton } from './components';
import Tabs from '@/components/Tab';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import {
  DeleteProductModal,
  EditProduct,
  ProductImageModal
} from '@/app/(dashboard)/products/components';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product>({} as Product);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: !!id
  });

  useEffect(() => {
    if (data?.data) {
      setProduct(data?.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.products);
  };

  const tabs = [
    { label: 'Sales', content: <p>This is the overview tab.</p> },
    { label: 'Subscribers', content: <p>Pricing details go here.</p> }
  ];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const closeImageModal = () => {
    setIsImageOpen(false);
  };

  const toggleEditModal = useCallback((value: boolean) => {
    setIsEditOpen(value);
  }, []);

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Product Details</SemiboldTitle>

            <Link href={app_routes.products}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="w-full flex gap-3 md:gap-6 items-start">
            <div
              className="w-[120px] h-[120px] max-w-[120px] max-h-[120px] md:w-[180px]  md:h-[180px] md:max-w-[180px] md:max-h-[180px] cursor-pointer"
              onClick={() => setIsImageOpen(true)}>
              <img
                src={product?.image}
                alt={product?.name}
                className="w-full h-full rounded-md object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <div className="flex flex-col gap-1">
                <div>
                  <SemiboldBody className="text-light-900">{product?.name}</SemiboldBody>
                </div>

                {product?.description && (
                  <div>
                    <SemiboldSmallText className="text-light-700">
                      {product?.description}
                    </SemiboldSmallText>
                  </div>
                )}
              </div>

              <div>
                <SemiboldSmallText className="text-secondary-700">
                  {renderPrice({ amount: product?.amount, currency: product?.currency })}
                </SemiboldSmallText>
              </div>

              {product?.is_recurring && (
                <div>
                  <SemiboldSmallText className="text-light-500">
                    Subscription:
                    <span className="text-light-700 ml-1">
                      {
                        billing_period_hours.find(
                          (period) => period.value === product?.billing_period_hours
                        )?.label
                      }
                    </span>
                  </SemiboldSmallText>
                </div>
              )}

              <div>
                <SemiboldSmallerText className="text-light-500">
                  Created:
                  <span className="text-light-700 ml-1">
                    {formatDate(product?.created_at, 'MMM D, YYYY hh:mm a')}
                  </span>
                </SemiboldSmallerText>
              </div>
            </div>
          </div>

          <div className="w-full mt-5 md:mt-10 bg-primary-150 rounded-lg px-3 md:px-4 py-3 md:py-4">
            <Tabs tabs={tabs} />
          </div>

          <div className="w-full flex gap-4 items-center border-none outline-none">
            <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
              Edit Product
            </SecondaryButton>

            <RedButton
              className="h-11 w-full border-none outline-none"
              onClick={() => setIsDeleteOpen(true)}>
              Delete
            </RedButton>
          </div>

          <EditProduct
            isEditOpen={isEditOpen}
            product={product}
            toggleEditModal={toggleEditModal}
          />

          <DeleteProductModal
            product={product}
            isDeleteOpen={isDeleteOpen}
            closeDeleteModal={closeDeleteModal}
          />

          <ProductImageModal
            product={product}
            isImageOpen={isImageOpen}
            closeImageModal={closeImageModal}
          />
        </div>
      )}
    </Drawer>
  );
}
