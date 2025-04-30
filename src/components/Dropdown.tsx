'use client';

import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  trigger: ReactNode;
  content: ReactNode;
  contentClass?: string;
  className?: string;
  buttonClass?: string;
  onSelectClose?: boolean;
  position?: 'top' | 'bottom';
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function Dropdown({
  trigger,
  content,
  contentClass,
  className,
  buttonClass,
  onSelectClose = false,
  position = 'bottom',
  open,
  setOpen
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If `open` and `setOpen` are provided, use them; otherwise, fall back to internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const toggleOpen = () => (setOpen ? setOpen((prev) => !prev) : setInternalOpen((prev) => !prev));
  const closeDropdown = useCallback(() => {
    if (setOpen) {
      setOpen(false);
    } else {
      setInternalOpen(false);
    }
  }, [setOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeDropdown]);

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button type="button" onClick={toggleOpen} aria-expanded={isOpen} className={buttonClass}>
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === 'bottom' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'bottom' ? 10 : -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={clsx(
              contentClass,
              'absolute left-0',
              position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
              'bg-primary-250 shadow-lg rounded-md z-10'
            )}
            onClick={onSelectClose ? closeDropdown : undefined}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
