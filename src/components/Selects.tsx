'use client';

import Dropdown from './Dropdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { countries } from 'countries-list';
import {
  RegularSmallerText,
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { FormikErrors, FormikTouched } from 'formik';
import { HTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dropdownClass?: string;
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  dropdownClass,
  errors,
  touched
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value);
  const showError =
    touched?.[name as unknown as keyof typeof touched] &&
    (errors?.[name as unknown as keyof typeof errors] as unknown as string);

  return (
    <Dropdown
      buttonClass={clsx(
        'w-full flex font-bold text-sm justify-between items-center px-4 py-2 rounded-md text-light-500 cursor-pointer bg-dark h-[50px] border-[1px]',
        {
          'border-red-700 focus:border-red-700 hover:border-red-700': showError,
          'border-light-400 focus:border-light-400 hover:border-light-400': !showError
        },
        className
      )}
      trigger={
        <>
          {selectedOption ? (
            <SemiboldSmallText className="text-light-900">{selectedOption.label}</SemiboldSmallText>
          ) : (
            placeholder
          )}
          <FontAwesomeIcon icon={faCaretDown} className="h-4 w-4" />
        </>
      }
      content={
        <div className="rounded-md shadow-md h-[300px] max-h-[300px] overflow-auto">
          <motion.ul>
            {options.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 cursor-pointer"
                onClick={() => onChange(option.value)}>
                <SemiboldSmallerText className="text-light-900">{option.label}</SemiboldSmallerText>
              </li>
            ))}
          </motion.ul>
        </div>
      }
      contentClass={clsx('mt-2 w-full', dropdownClass)}
      onSelectClose
    />
  );
}

interface CountriesSelectProps extends HTMLAttributes<HTMLSelectElement> {
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (value: string | number) => void;
  value: string | undefined;
  name: string;
  label?: string;
  placeholder?: string;
}

export const CountrySelect = ({
  handleChange,
  value,
  errors,
  touched,
  name,
  label,
  placeholder = 'Countries'
}: CountriesSelectProps) => {
  const showError = touched && errors && touched[name] && errors[name];
  const notAllowedCountries = [
    'Iran',
    'North Korea',
    'Syria',
    'Iraq',
    'Lebanon',
    'Russia',
    'Cuba',
    'Palestine',
    'Somalia',
    'Sudan',
    'Afghanistan',
    'Belarus',
    'Venezuela',
    'Nicaragua',
    'Burma',
    'Ethiopia',
    'China',
    'Congo',
    'Libya',
    'Mali',
    'Yemen',
    'Myanmar'
  ];

  const options = Object.values(countries)
    .filter((country) => !notAllowedCountries.includes(country.name))
    .map((country) => {
      return {
        value: country.name,
        label: country.name
      };
    });

  return (
    <div className="w-full">
      {label && (
        <SemiboldBody className="text-light-700 transition-opacity duration-300">
          {label}
        </SemiboldBody>
      )}

      <div className="mb-1 pb-1 mt-1 pt-1">
        <Select placeholder={placeholder} value={value} onChange={handleChange} options={options} />
      </div>

      {showError ? (
        <RegularSmallerText className="pt-2 text-error">
          {errors[name]?.toString()}
        </RegularSmallerText>
      ) : null}
    </div>
  );
};
