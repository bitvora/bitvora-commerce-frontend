import { ReactNode } from 'react';
import ReactModal from 'react-modal';

export default function Modal({
  children,
  open,
  onClose,
  className = ''
}: {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      className={`p-5 rounded-lg bg-primary-50 border-none outline-none shadow-lg h-auto ${className}`}
      overlayClassName="fixed inset-0 bg-black/90 flex items-center justify-center">
      {children}
    </ReactModal>
  );
}
