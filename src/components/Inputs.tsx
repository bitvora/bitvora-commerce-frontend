'use client';

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  type ChangeEvent,
  type HTMLAttributes,
  JSX
} from 'react';
import { type FormikErrors, type FormikTouched } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { SemiboldBody, RegularSmallerText, SemiboldSmallText, SemiboldSmallerText } from './Text';
import PhoneInput from 'react-phone-number-input';
import { country_codes } from '@/lib/constants';
import { copyToClipboard, maskString } from '@/lib/helpers';

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
  label?: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url';
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  value: string | number;
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
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
  startIcon,
  value,
  showLabel = false,
  disabled,
  required,
  className
}: DarkInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isNumberType = type === 'number';
  const [inputType, setInputType] = useState(isNumberType ? 'text' : type);

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  const showError =
    touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

  const formatWithCommas = (num: string) => {
    // Split integer and decimal parts
    const [integerPart, decimalPart] = num.split('.');

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Return combined formatted number
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNumberType) {
      return handleChange(event); // ✅ Use default onChange for non-number types
    }

    const input = event.target;
    let rawValue = input.value.replace(/,/g, ''); // Remove existing commas

    // ✅ Allow numbers & decimals but prevent multiple dots
    if (!/^\d*\.?\d*$/.test(rawValue)) return;

    // ✅ Prevent multiple leading zeros unless it's "0." (e.g., "0012" → "12", but "0.1" is valid)
    if (rawValue.startsWith('0') && rawValue.length > 1 && !rawValue.startsWith('0.')) {
      rawValue = rawValue.replace(/^0+/, '');
    }

    const formattedValue = formatWithCommas(rawValue);

    // Preserve cursor position
    const cursorPosition = input.selectionStart!;
    const commaCountBefore = (input.value.slice(0, cursorPosition).match(/,/g) || []).length;
    input.value = formattedValue;
    const commaCountAfter = (formattedValue.slice(0, cursorPosition).match(/,/g) || []).length;
    const newCursorPosition = cursorPosition + (commaCountAfter - commaCountBefore);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);

    // Create event with raw value (without commas) for form state
    const eventWithRawValue = {
      ...event,
      target: { ...event.target, name, value: rawValue }
    };
    handleChange(eventWithRawValue);
  };

  return (
    <div className="text-left">
      {(showLabel || value) && label && (
        <div className="mb-1 pb-1 flex items-start gap-1">
          <SemiboldBody className="text-light-700 transition-opacity duration-300">
            {label}
          </SemiboldBody>
          {required && !disabled && (
            <SemiboldBody className="text-light-700 transition-opacity duration-300">
              *
            </SemiboldBody>
          )}
        </div>
      )}

      <div className="relative mt-1 mb-1">
        <input
          ref={inputRef}
          value={isNumberType ? formatWithCommas(value.toString()) : value}
          name={name}
          required={required}
          onChange={handleInputChange}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
          className={clsx(
            'border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full bg-dark',
            'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none',
            {
              'border-red-700 focus:border-red-700 hover:border-red-700': showError,
              'border-light-400 focus:hover:border-primary-500 hover:hover:border-primary-500':
                !showError
            },
            { 'pl-10': startIcon },
            className
          )}
        />

        {type === 'password' ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
          </div>
        ) : (
          <>
            {endIcon && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">{endIcon}</div>
            )}
          </>
        )}

        {startIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">{startIcon}</div>
        )}
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

interface DarkTextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  placeholder?: string;
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

export const DarkTextarea = ({
  label,
  name,
  placeholder,
  touched,
  errors,
  handleChange,
  value,
  showLabel = false,
  disabled,
  required,
  rows = 4
}: DarkTextareaProps) => {
  const showError =
    touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

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
        <textarea
          value={value}
          name={name}
          required={required}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full bg-dark',
            'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none resize-none',
            {
              'border-red-700 focus:border-red-700 hover:border-red-700': showError,
              'border-light-400 focus:hover:border-primary-500 hover:hover:border-primary-500':
                !showError
            }
          )}
          rows={rows}
        />
      </div>

      {showError && (
        <RegularSmallerText className="pt-1 text-red-700">
          {errors[name as keyof typeof errors]}
        </RegularSmallerText>
      )}
    </div>
  );
};

interface PhoneNumberInputProps {
  label?: string;
  name: string;
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (value: string | undefined) => void;
  value: string;
  showLabel?: boolean;
  required?: boolean;
}

export const PhoneNumberInput = ({
  label,
  name,
  touched,
  errors,
  handleChange,
  value,
  showLabel = false,
  required
}: PhoneNumberInputProps) => {
  const showError = touched && errors && touched[name] && errors[name];

  return (
    <div className="text-left justify-start">
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

      <div className="relative mt-1" id="phone-number">
        <PhoneInput
          placeholder="Phone number"
          value={value}
          onChange={(value) => {
            handleChange(value?.toString());
          }}
          international
          countries={country_codes}
        />
      </div>

      {showError ? (
        <RegularSmallerText className="pt-1 text-red-700">
          {errors[name]?.toString()}
        </RegularSmallerText>
      ) : null}
    </div>
  );
};

export interface DarkAutocompleteHandle {
  clear: () => void;
}

interface DarkAutocompleteProps<T> {
  label?: string;
  name: string;
  placeholder?: string;
  options: T[];
  required?: boolean;
  className?: string;
  onChange: (value: T) => void;
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  showLabel?: boolean;
  getOptionLabel?: (option: T) => string;
  renderOption?: (option: T) => ReactNode;
  isInputComplete?: boolean;
  defaultValue?: string;
}

export const InnerDarkAutocomplete = <T,>(
  {
    label,
    name,
    placeholder,
    options,
    required,
    className,
    onChange,
    touched,
    errors,
    showLabel,
    getOptionLabel = (option) => String(option),
    renderOption,
    isInputComplete = false,
    defaultValue
  }: DarkAutocompleteProps<T>,
  ref: React.Ref<DarkAutocompleteHandle>
) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isComplete, setIsComplete] = useState(isInputComplete);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setInputValue('');
      setFilteredOptions(options);
      setIsComplete(false);
    }
  }));

  useEffect(() => {
    if (defaultValue) {
      const selectedOption = options.find((option) => getOptionLabel(option) === defaultValue);
      if (selectedOption) {
        setInputValue(getOptionLabel(selectedOption));
        setIsComplete(true);
      }
    }
  }, [defaultValue, options, getOptionLabel]);

  const showError =
    touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(value.toLowerCase().trim())
    );

    setFilteredOptions(filtered);
    setShowDropdown(true);
    setActiveIndex(-1);
  };

  const handleSelect = (option: T) => {
    setInputValue(getOptionLabel(option));
    onChange(option);
    setShowDropdown(false);
    setFilteredOptions(options);
    setIsComplete(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      handleSelect(filteredOptions[activeIndex]);
    } else if (event.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-left">
      {(showLabel || inputValue) && label && (
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

      <div className="relative mt-1 mb-1 w-full">
        {inputValue && isComplete ? (
          <div
            ref={inputRef}
            className={clsx(
              'border-[1px] rounded-md py-6 px-4 font-bold text-sm xl:text-base w-full bg-dark h-[50px] flex items-center border-light-400'
            )}>
            <div className="text-light-900 flex gap-1 bg-light-overlay-50 rounded-3xl pl-4 pr-3 items-center h-8">
              <SemiboldSmallerText>{inputValue}</SemiboldSmallerText>

              <button
                onClick={() => {
                  setInputValue('');
                  setFilteredOptions(options);
                  setIsComplete(false);
                }}
                className="p-2 flex items-center justify-center text-center text-light-900 hover:text-light-700 transition border-none outline-none cursor-pointer">
                <FontAwesomeIcon icon={faXmark} style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            required={required}
            className={clsx(
              'border-[1px] rounded-md py-3.5 px-4 font-bold text-sm xl:text-base w-full bg-dark',
              'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none',
              {
                'border-red-700 focus:border-red-700 hover:border-red-700': showError,
                'border-light-400 focus:hover:border-primary-500 hover:hover:border-primary-500':
                  !showError
              },
              className
            )}
            autoComplete="off"
          />
        )}

        {!isComplete && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light-700">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        )}

        {showDropdown && filteredOptions.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute w-full bg-dark border border-primary-400 rounded-md mt-1 max-h-40 overflow-y-auto shadow-md z-10 px-4">
            {filteredOptions.map((option, index) => (
              <li
                key={getOptionLabel(option)}
                className={clsx(
                  'py-3 px-0 cursor-pointer text-light-900 hover:text-light-700 product-currency-item border-b-[0.5px] border-light-300 flex text-start justify-start',
                  index === activeIndex ? 'bg-primary-150' : ''
                )}
                onMouseDown={() => handleSelect(option)}>
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <SemiboldSmallText className="text-inherit">
                    {getOptionLabel(option)}
                  </SemiboldSmallText>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const DarkAutocomplete = forwardRef(InnerDarkAutocomplete) as <T>(
  props: DarkAutocompleteProps<T> & { ref?: React.Ref<DarkAutocompleteHandle> }
) => JSX.Element;

export const ReadonlyInput = ({
  label,
  value,
  hidden = false
}: {
  label?: string;
  value: string;
  hidden?: boolean;
}) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <SemiboldBody className="text-light-500">{label}</SemiboldBody>}

      <div className="rounded-md px-4 py-3 h-14 flex items-center border-[0.5px] border-light-600 w-full justify-between gap-4 relative">
        <div className="flex items-center w-full overflow-x-scroll pr-10 mr-10">
          {hidden ? (
            <SemiboldSmallText className={!isShown && 'pt-1'}>
              {isShown ? value : maskString(value)}
            </SemiboldSmallText>
          ) : (
            <SemiboldSmallText>{value}</SemiboldSmallText>
          )}
        </div>

        {hidden && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {!isShown && (
              <button
                onClick={() => setIsShown(true)}
                className="text-light-700 focus:text-light-900 hover:text-light-900 cursor-pointer bg-primary-50 h-8 w-8 rounded-md"
                type="button">
                <FontAwesomeIcon icon={faEye} className="text-current" />
              </button>
            )}

            {isShown && (
              <button
                onClick={() => copyToClipboard({ text: value })}
                className="text-light-700 focus:text-light-900 hover:text-light-900 cursor-pointer bg-primary-50 h-8 w-8 rounded-md"
                type="button">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const DarkReadonlyInput = ({
  label,
  value,
  hidden = false
}: {
  label?: string;
  value: string;
  hidden?: boolean;
}) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <SemiboldBody className="text-light-500">{label}</SemiboldBody>}

      <div className="rounded-md px-4 py-3 h-14 flex items-center bg-dark border-[0.5px] border-light-600 w-full justify-between gap-4 relative">
        <div className="flex items-center w-full overflow-x-scroll pr-10 mr-10">
          {hidden ? (
            <SemiboldSmallText className={!isShown && 'pt-1'}>
              {isShown ? value : maskString(value)}
            </SemiboldSmallText>
          ) : (
            <SemiboldSmallText>{value}</SemiboldSmallText>
          )}
        </div>

        {hidden && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {!isShown && (
              <button
                onClick={() => setIsShown(true)}
                className="text-light-700 focus:text-light-900 hover:text-light-900 cursor-pointer bg-primary-50 h-8 w-8 rounded-md"
                type="button">
                <FontAwesomeIcon icon={faEye} className="text-current" />
              </button>
            )}

            {isShown && (
              <button
                onClick={() => copyToClipboard({ text: value })}
                className="text-light-700 focus:text-light-900 hover:text-light-900 cursor-pointer bg-primary-50 h-8 w-8 rounded-md"
                type="button">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
