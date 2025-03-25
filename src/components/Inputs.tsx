import { useState, type ChangeEvent, type HTMLAttributes } from 'react';
import { type FormikErrors, type FormikTouched } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MediumBody, RegularSmallerText } from './Text';

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
          <MediumBody className="text-light-500 transition-opacity duration-300">
            {label}
          </MediumBody>
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
          className="border-light-400 focus:border-primary-500 hover:border-primary-500
            placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none 
            bg-transparent border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full"
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
        <RegularSmallerText className="pt-2 text-red-700">
          {errors[name as keyof typeof errors]}
        </RegularSmallerText>
      )}
    </div>
  );
};
