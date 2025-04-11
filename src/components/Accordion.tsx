'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

type Props = {
  items: {
    label: string | ReactNode;
    content: ReactNode;
  }[];
  triggerClassName?: string;
  contentClassName: string;
  containerClassName?: string;
};

const Accordion = ({ items, triggerClassName, contentClassName, containerClassName }: Props) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={clsx('w-full space-y-2')}>
      {items.map((item, index) => (
        <div key={index} className={clsx('overflow-hidden', containerClassName)}>
          <button
            className={clsx(
              'w-full flex justify-between items-center outline-none cursor-pointer text-light-700 hover:text-light-900',
              triggerClassName
            )}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              toggleItem(index);
            }}>
            {item?.label}

            <FontAwesomeIcon icon={openIndex === index ? faAngleUp : faAngleDown} color="inherit" />
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: openIndex === index ? 'auto' : 0,
              opacity: openIndex === index ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={clsx('overflow-hidden', contentClassName)}>
            {item?.content}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
