'use client';

import { useRouter } from 'next/navigation';
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
import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { copyToClipboard, formatDate, formatUUID, renderPrice } from '@/lib/helpers';
import { Skeleton, Subscribers } from './components';
import Tabs from '@/components/Tab';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import {
  DeleteProductModal,
  EditProduct,
  ProductImageModal
} from '@/app/(dashboard)/products/components';
import React from 'react';
import { Link } from '@/components/Links';
import ImageComponent from '@/components/Image';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const [product, setProduct] = useState<Product>({} as Product);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    refetchOnWindowFocus: true
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
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Product Details</SemiboldTitle>

            <Link href={app_routes.products}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="w-full flex gap-3 sm:gap-6 items-start">
            <div
              className="w-[120px] h-[120px] max-w-[120px] max-h-[120px] sm:w-[180px]  sm:h-[180px] sm:max-w-[180px] sm:max-h-[180px] cursor-pointer"
              onClick={() => setIsImageOpen(true)}>
              <ImageComponent
                src={product?.image}
                alt={product?.name}
                className="w-full h-full rounded-md object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
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

              <div className="flex items-center gap-1">
                <SemiboldSmallerText className="text-light-500">Product ID:</SemiboldSmallerText>

                <div className="flex items-center gap-2">
                  <SemiboldSmallerText className="text-light-700 ml-1">
                    {formatUUID(product?.id)}
                  </SemiboldSmallerText>

                  <button
                    className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
                    onClick={() => copyToClipboard({ text: product?.id })}>
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-5 md:mt-10 bg-primary-150 rounded-lg px-3 md:px-4 py-3 md:py-4">
            <Tabs tabs={[{ label: 'Subscriptions', content: <Subscribers /> }]} />
          </div>

          <div className="flex gap-4 items-center border-none outline-none fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10">
            <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
              Edit Product
            </SecondaryButton>

            <RedButton
              className="h-11 w-full border-none outline-none"
              onClick={() => setIsDeleteOpen(true)}>
              Delete Product
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
