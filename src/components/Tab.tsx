import { SemiboldBody } from '@/components/Text';
import { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveIndex?: number;
}

export default function Tabs({ tabs, defaultActiveIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className="w-full">
      <div className="flex border-b border-light-200 gap-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-semibold cursor-pointer ${
              activeIndex === index
                ? 'border-b-2 border-primary-600 text-light-900'
                : 'text-light-700 hover:text-light-900'
            }`}
            onClick={() => setActiveIndex(index)}>
            <SemiboldBody className="text-inherit">{tab.label}</SemiboldBody>
          </button>
        ))}
      </div>

      <div>{tabs[activeIndex]?.content}</div>
    </div>
  );
}
