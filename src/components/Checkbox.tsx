'use client';

import { SemiboldBody } from '@/components/Text';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface CheckboxProps {
  label: string | React.ReactNode;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = ({
  label,
  name,
  checked = false,
  indeterminate = false,
  onChange,
  disabled
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Update checked state if the prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  // Set the indeterminate state for the checkbox using a ref
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <label
      className={`flex items-center gap-3 p-2 rounded-md transition ${
        isChecked ? 'text-light-900' : 'text-light-700'
      }`}>
      <input
        ref={checkboxRef}
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={handleToggle}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={clsx(
          `w-4 h-4 flex items-center justify-center border-1 rounded-md`,
          {
            'border-primary-700': isChecked || indeterminate
          },
          {
            'border-light-400': disabled
          },
          { 'border-light-700 cursor-pointer': !disabled }
        )}>
        {(isChecked || indeterminate) && (
          <div className={`${indeterminate ? 'w-2 h-0.5' : 'w-2 h-2'} bg-primary-700 rounded-sm`} />
        )}
      </div>
      <SemiboldBody
        className={clsx('text-inherit', {
          'text-light-400': disabled
        })}>
        {label}
      </SemiboldBody>
    </label>
  );
};
