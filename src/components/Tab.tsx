import { SemiboldBody, SemiboldSmallerText, SemiboldSmallText } from '@/components/Text';
import clsx from 'clsx';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveIndex?: number;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Tabs({
  tabs,
  defaultActiveIndex = 0,
  type = 'primary',
  disabled
}: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className="w-full">
      <div
        className={clsx('flex gap-2', {
          'border-b border-light-200': type === 'primary',
          'w-full justify-between bg-dark h-full py-2 items-center px-2 rounded-md':
            type === 'secondary'
        })}
        role="tablist">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              disabled={disabled}
              className={clsx(
                'px-4 py-2 text-sm font-semibold h-9 md:h-11',
                {
                  'cursor-not-allowed': disabled,
                  'cursor-pointer': !disabled
                },

                type === 'primary' && {
                  'border-b-2 border-primary-600 text-light-900': isActive,
                  'text-light-700 hover:text-light-900': !isActive
                },
                type === 'secondary' && {
                  'w-full flex justify-center text-center items-center bg-primary-100 rounded-md text-light-900':
                    isActive,
                  'w-full flex justify-center text-center items-center bg-transparent text-light-400 hover:text-light-900':
                    !isActive
                }
              )}
              onClick={() => {
                if (disabled) return;
                setActiveIndex(index);
              }}
              role="tab"
              aria-selected={isActive}>
              {type === 'primary' ? (
                <SemiboldBody className="text-inherit">{tab.label}</SemiboldBody>
              ) : (
                <>
                  <SemiboldSmallText className="text-inherit hidden md:flex">
                    {tab.label}
                  </SemiboldSmallText>
                  <SemiboldSmallerText className="text-inherit md:hidden">
                    {tab.label}
                  </SemiboldSmallerText>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[100px]" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}>
            {tabs[activeIndex]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
