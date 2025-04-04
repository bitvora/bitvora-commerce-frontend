'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
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
}

export default function Dropdown({
  trigger,
  content,
  contentClass,
  className,
  buttonClass,
  onSelectClose = false,
  position = 'bottom'
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button type="button" onClick={toggleOpen} aria-expanded={open} className={buttonClass}>
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
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
