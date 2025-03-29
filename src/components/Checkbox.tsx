'use client';

import { SemiboldBody } from '@/components/Text';
import { useState } from 'react';

interface CheckboxProps {
  label: string | React.ReactNode;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ label, name, checked = false, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <label
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
        isChecked ? 'text-light-900' : 'text-light-700'
      }`}>
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={handleToggle}
        className="hidden"
      />
      <div
        className={`w-4 h-4 flex items-center justify-center border-1 rounded-md ${
          isChecked ? 'border-primary-700' : 'border-light-700'
        }`}>
        {isChecked && <div className="w-2 h-2 bg-primary-700 rounded-sm" />}
      </div>
      <SemiboldBody className="text-inherit">{label}</SemiboldBody>
    </label>
  );
};
