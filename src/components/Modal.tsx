import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      className={`relative p-5 rounded-lg bg-primary-50 border-none outline-none shadow-lg h-auto z-[500] ${className}`}
      overlayClassName="fixed inset-0 bg-black/90 flex items-center justify-center z-[500]">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 p-2 flex items-center justify-center text-center text-light-900 hover:text-light-700 transition border-none outline-none cursor-pointer z-[510]">
        <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
      </button>

      {children}
    </ReactModal>
  );
}
