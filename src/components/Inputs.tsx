'use client';

import { ReactNode, useState, type ChangeEvent, type HTMLAttributes } from 'react';
import { type FormikErrors, type FormikTouched } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { SemiboldBody, RegularSmallerText, SemiboldSmallText } from './Text';

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  endIcon?: React.ReactNode;
  value: string;
  showLabel?: boolean;
  disabled?: boolean;
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  name,
  touched,
  errors,
  handleChange,
  endIcon,
  value,
  showLabel = false,
  disabled
}: InputProps) => {
  const [inputType, setInputType] = useState(type);
  const showError =
    touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  return (
    <div className="text-left">
      {(showLabel || value) && (
        <div className="mb-1 pb-1">
          <SemiboldBody className="text-light-700 transition-opacity duration-300">
            {label}
          </SemiboldBody>
        </div>
      )}

      <div className="relative mt-1 mb-1">
        <input
          value={value}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
          className={clsx(
            'border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full',
            'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none bg-transparent',
            {
              'border-red-700 focus:border-red-700 hover:border-red-700': showError,
              'border-light-400 focus:border-primary-500 hover:border-primary-500': !showError
            }
          )}
        />

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {type === 'password' ? (
            <button
              onClick={togglePasswordVisibility}
              className="text-light-400 focus:text-primary-500 hover:text-primary-500 cursor-pointer"
              type="button"
              aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}>
              <FontAwesomeIcon
                icon={inputType === 'password' ? faEye : faEyeSlash}
                className="text-current"
              />
            </button>
          ) : (
            endIcon
          )}
        </div>
      </div>

      {showError && (
        <RegularSmallerText className="pt-1 text-red-700">
          {errors[name as keyof typeof errors]}
        </RegularSmallerText>
      )}
    </div>
  );
};

interface DarkInputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url';
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  endIcon?: React.ReactNode;
  value: string;
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const DarkInput = ({
  label,
  type = 'text',
  placeholder,
  name,
  touched,
  errors,
  handleChange,
  endIcon,
  value,
  showLabel = false,
  disabled,
  required
}: DarkInputProps) => {
  const [inputType, setInputType] = useState(type);
  const showError =
    touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  return (
    <div className="text-left">
      {(showLabel || value) && (
        <div className="mb-1 pb-1 flex items-start gap-1">
          <SemiboldBody className="text-light-700 transition-opacity duration-300">
            {label}
          </SemiboldBody>
          {required && (
            <SemiboldBody className="text-light-700 transition-opacity duration-300">
              *
            </SemiboldBody>
          )}
        </div>
      )}

      <div className="relative mt-1 mb-1">
        <input
          value={value}
          name={name}
          required={required}
          onChange={handleChange}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
          className={clsx(
            'border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full bg-dark',
            'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none',
            {
              'border-red-700 focus:border-red-700 hover:border-red-700': showError,
              'border-light-400 focus:border-light-400 hover:border-light-400': !showError
            }
          )}
        />

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {type === 'password' ? (
            <button
              onClick={togglePasswordVisibility}
              className="text-light-400 focus:text-primary-500 hover:text-primary-500 cursor-pointer"
              type="button"
              aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}>
              <FontAwesomeIcon
                icon={inputType === 'password' ? faEye : faEyeSlash}
                className="text-current"
              />
            </button>
          ) : (
            endIcon
          )}
        </div>
      </div>

      {showError && (
        <RegularSmallerText className="pt-1 text-red-700">
          {errors[name as keyof typeof errors]}
        </RegularSmallerText>
      )}
    </div>
  );
};

interface RadioOption<T> {
  label: string | ReactNode;
  value: T;
}

interface RadioGroupProps<T> {
  options: RadioOption<T>[];
  name: string;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export const RadioGroup = <T,>({ options, name, defaultValue, onChange }: RadioGroupProps<T>) => {
  const [selected, setSelected] = useState<T>(defaultValue ?? options[0]?.value);

  const handleSelect = (value: T) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="w-full max-w-sm p-2 rounded-lg">
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={JSON.stringify(option.value)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
              selected === option.value ? 'text-secondary-700' : 'text-light-700'
            }`}>
            <input
              type="radio"
              name={name}
              checked={selected === option.value}
              onChange={() => handleSelect(option.value)}
              className="hidden"
            />
            <div
              className={`w-4 h-4 flex items-center justify-center border-2 rounded-full ${
                selected === option.value ? 'border-2 border-primary-700' : 'border-gray-400'
              }`}>
              {selected === option.value && <div className="w-2 h-2 bg-primary-700 rounded-full" />}
            </div>
            <SemiboldSmallText>{option.label}</SemiboldSmallText>
          </label>
        ))}
      </div>
    </div>
  );
};
