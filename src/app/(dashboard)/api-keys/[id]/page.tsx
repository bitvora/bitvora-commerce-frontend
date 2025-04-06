'use client';

import { app_routes } from '@/lib/constants';
import { getAPIKey } from './actions';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Drawer from 'react-modern-drawer';
import { SemiboldBody, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Accordion from '@/components/Accordion';
import { Skeleton } from './components';
import { formatKeyName } from '@/lib/helpers';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import { DeleteAPIKey, EditAPIKey } from '@/app/(dashboard)/api-keys/components';
import { Link } from '@/components/Links';
import { APIKey } from '@/types/api-keys';
import clsx from 'clsx';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [apiKey, setAPIKey] = useState<APIKey>({} as APIKey);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['api-key', id],
    queryFn: () => getAPIKey(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (data?.data) {
      setAPIKey(data.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.api_keys);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const toggleEditModal = useCallback((value: boolean) => {
    setIsEditOpen(value);
  }, []);

  const accordionItems =
    apiKey?.permissions &&
    Object.entries(apiKey.permissions).map(([label, values]) => {
      const total = Object.keys(values).length;
      const checked = Object.values(values).filter(Boolean).length;

      return {
        label: (
          <div className="w-full justify-start text-start">
            <SemiboldBody className="text-light-700 capitalize">
              {formatKeyName(label)} ({checked}/{total})
            </SemiboldBody>
          </div>
        ),
        content: (
          <div className="flex flex-col gap-5 px-2 mb-2 relative">
            {Object.entries(values).map(([key, value]) => (
              <div
                className={clsx('flex items-center gap-2', {
                  'text-green-700': value,
                  'text-red-700': !value
                })}
                key={key}>
                <SemiboldSmallText className="text-light-900 capitalize">{key}</SemiboldSmallText>
                <FontAwesomeIcon
                  icon={value ? faCheck : faXmark}
                  className="text-inherit w-8 h-8"
                />
              </div>
            ))}
          </div>
        )
      };
    });
  // .filter(Boolean);

  return (
    <>
      <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">API Key</SemiboldTitle>

              <Link href={app_routes.api_keys}>
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
                items={accordionItems}
              />
            </div>

            <div className="w-full flex gap-4 items-center border-none outline-none">
              <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
                Edit API Key
              </SecondaryButton>

              <RedButton
                className="h-11 w-full border-none outline-none"
                onClick={() => setIsDeleteOpen(true)}>
                Delete API Key
              </RedButton>
            </div>
          </div>
        )}
      </Drawer>

      <EditAPIKey apiKey={apiKey} toggleEditModal={toggleEditModal} isEditOpen={isEditOpen} />

      <DeleteAPIKey
        apiKey={apiKey}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />
    </>
  );
}
