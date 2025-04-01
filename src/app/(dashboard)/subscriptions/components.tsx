'use client';

import { Subscription } from '@/types/subscriptions';
import { useSubscriptionContext } from './context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSubscription } from './actions';
import toast from 'react-hot-toast';
import { app_routes } from '@/lib/constants';
import Modal from '@/components/Modal';
import { DeleteIcon } from '@/components/Icons';
import { MediumTitle, SemiboldSmallText } from '@/components/Text';
import { RedButton, SecondaryButton } from '@/components/Buttons';

export const DeleteSubscriptionModal = ({
  subscription,
  isDeleteOpen,
  closeDeleteModal
}: {
  subscription: Subscription;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchSubscriptions } = useSubscriptionContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteProduct = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteSubscription(subscription.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting product');
        return;
      }

      toast.success('Product deleted successfully');
      refetchSubscriptions();
      closeDeleteModal();
      router.push(app_routes.subscriptions);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      className="w-full max-w-[600px] p-8 flex flex-col gap-6"
      open={isDeleteOpen}
      onClose={closeDeleteModal}>
      <div className="bg-red-50 w-11 h-11 flex items-center text-center justify-center rounded-md">
        <DeleteIcon height={20} width={20} />
      </div>

      <div className="flex flex-col gap-1">
        <MediumTitle className="text-light-900">
          Are you sure you want to delete this subscription?
        </MediumTitle>
        <SemiboldSmallText className="text-light-700">
          This action cannot be undone.
        </SemiboldSmallText>
      </div>

      <div className="w-full flex items-center md:ml-auto justify-between md:justify-end gap-4 mt-4">
        <SecondaryButton className="h-11 w-full md:w-28" onClick={closeDeleteModal}>
          Cancel
        </SecondaryButton>

        <RedButton
          className="h-11 w-full md:w-27"
          loading={isDeleting}
          onClick={handleDeleteProduct}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};
