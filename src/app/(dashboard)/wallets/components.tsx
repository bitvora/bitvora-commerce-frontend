'use client';

import { useAppContext } from '@/contexts';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import {
  MediumBody,
  MediumHeader5,
  MediumSmallText,
  RegularSmallerText,
  SemiboldBody,
  SemiboldHeader3,
  SemiboldSmallerText,
  SemiboldSmallText,
  SemiboldTitle
} from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
  FocusEvent,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Formik, Form, FormikTouched, FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Drawer from 'react-modern-drawer';
import { CloseIcon, FilterIcon, PasteIcon, RefreshIcon } from '@/components/Icons';
import { DarkInput } from '@/components/Inputs';
import { connectWallet, withdrawBitcoin } from './actions';
import {
  btcToSats,
  convertSatsToFiat,
  formatDate,
  getAllTime,
  getAmountFromString,
  getThisMonth,
  getThisYear,
  getToday,
  getYesterday,
  isLightningInvoice,
  pasteToClipboard,
  renderPrice,
  satsToBTC
} from '@/lib/helpers';
import clsx from 'clsx';
import numeral from 'numeral';
import Image from 'next/image';
import lightBolt11Decoder from 'light-bolt11-decoder';
import Tabs from '@/components/Tab';

export const SwitchWallet = () => {
  const { currentAccount, refetchWallet } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === app_routes.wallet && searchParams.get('action') === 'connect-wallet') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.wallet);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.wallet}?action=connect-wallet`);
  };

  return (
    <>
      <SecondaryButton
        className="h-10 md:h-11 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>Switch Wallet</SemiboldSmallText>
      </SecondaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Wallet Connect</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                wallet_connect: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                wallet_connect: Yup.string().required('Name is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                const payload = {
                  account_id: currentAccount?.id,
                  wallet_connect: values.wallet_connect
                };

                try {
                  const result = await connectWallet(payload);

                  if (!result.success) {
                    toast.error(result.error || 'Error connecting wallet');
                    return;
                  }

                  refetchWallet();
                  toast.success('Wallet connected successfully');
                  handleClose();
                  resetForm();
                  router.push(`${app_routes.wallet}/${result?.data?.data?.id}`);
                } catch (err) {
                  console.error(err);
                  toast.error('Error connecting wallet');
                }
              }}>
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                isValid,
                dirty
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Wallet Connect URL"
                        handleChange={handleChange}
                        name="wallet_connect"
                        errors={errors}
                        touched={touched}
                        placeholder="Wallet Connect URL"
                        value={values.wallet_connect}
                        showLabel
                        required
                      />

                      <SemiboldSmallerText className="text-light-700 mt-2 pt-2">
                        Enter the wallet connect URL from your compatible wallet application
                      </SemiboldSmallerText>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-6 fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || !dirty}>
                        Connect Wallet
                      </PrimaryButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Drawer>
    </>
  );
};

type CurrencyType = 'sats' | 'btc';

const initialValues = {
  recipient: '',
  amount: ''
};

interface IWithdrawal {
  fees_paid: number;
  invoice: string;
  preimage: string;
  wallet_id: string;
  recipient: string;
  amount: number;
}

export const WithdrawBitcoin = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentAccount, balance } = useAppContext();
  const inputRef = useRef<WithdrawalAmountHandle>(null);
  const [paymentType, setPaymentType] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyType>('sats');
  const [tab, setTab] = useState(1);
  const [withdrawalDetails, setWithdrawalDetails] = useState<IWithdrawal>({} as IWithdrawal);
  const { currency: userCurrency, refetchBalance } = useAppContext();
  const [fiatAmount, setFiatAmount] = useState(0);

  useEffect(() => {
    if (pathname === app_routes.wallet && searchParams.get('action') === 'withdraw-bitcoin') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setTab(1);
    setOpen(false);
    router.replace(app_routes.wallet);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.wallet}?action=withdraw-bitcoin`);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        account_id: currentAccount?.id,
        recipient: values.recipient,
        amount: currency === 'sats' ? Number(values.amount) : btcToSats(Number(values.amount))
      };

      if (payload.amount >= balance) {
        toast.error('Insufficient balance');
        return;
      }

      try {
        const result = await withdrawBitcoin(payload);
        if (!result.success) {
          toast.error(result.error || 'Error making withdrawal');
          return;
        }
        toast.success(result?.data?.message || 'Payment sent successfully');
        setWithdrawalDetails({
          ...withdrawalDetails,
          ...result?.data?.data,
          ...payload
        });

        setTab(2);
        resetForm();
        refetchBalance();
      } catch (err) {
        console.error(err);
        toast.error('Error making withdrawal');
      }
    },
    validationSchema: Yup.object({
      recipient: Yup.string().required('Name is required'),
      amount: Yup.string().required('Amount is required')
    }),
    enableReinitialize: true
  });

  const toggleCurrency = (event) => {
    event.preventDefault();

    if (currency === 'sats') {
      setCurrency('btc');
      formik.setFieldValue('amount', satsToBTC(Number(formik.values.amount)));
    } else {
      setCurrency('sats');
      formik.setFieldValue('amount', btcToSats(Number(formik.values.amount)));
    }

    setTimeout(() => {
      inputRef.current?.format();
    }, 0);
  };

  const handleDestinationChange = (value: string): void => {
    let trimmedValue = value.trim();

    if (trimmedValue.toLowerCase().startsWith('bitcoin:')) {
      trimmedValue = trimmedValue.replace(/^bitcoin:/i, '');
    }

    setIsInputDisabled(false);
    setPaymentType('');
    formik.setFieldValue('recipient', trimmedValue);

    let amount = 0;

    if (isLightningInvoice(trimmedValue)) {
      setPaymentType('lightning');
      try {
        const ln = lightBolt11Decoder.decode(trimmedValue);
        const amountObject = ln?.sections.find(
          (item: lightBolt11Decoder.Section) => item.name === 'amount'
        );
        const amountValue = amountObject?.value;

        if (amountValue) {
          amount = Number(amountValue) / 1000;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const amountFromString = getAmountFromString(trimmedValue);
      setPaymentType(amountFromString > 0 ? 'onchain' : '');
      amount = btcToSats(amountFromString);
    }

    formik.setFieldValue('amount', amount);
    setIsInputDisabled(amount > 0);
  };

  useEffect(() => {
    const fetchFiatAmount = async () => {
      if (!withdrawalDetails?.amount) return;

      const response = await convertSatsToFiat({
        sats: withdrawalDetails.amount,
        fiat: userCurrency?.value === 'sats' ? 'usd' : userCurrency?.value
      });

      setFiatAmount(response?.fiat_amount || 0);
    };

    fetchFiatAmount();
  }, [userCurrency?.value, withdrawalDetails.amount]);

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12! lg:h-12! xl:h-12! 2xl:h-12! w-full min-w-[140px]"
        onClick={handleOpen}>
        Withdraw Bitcoin
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">
              {tab === 1 ? 'Withdraw' : 'Transaction Details'}
            </SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          {tab === 2 && (
            <div className="overflow-auto h-full w-full">
              <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full flex flex-col gap-4">
                <div className="rounded-lg px-5 py-5 bg-primary-40 w-full flex flex-col gap-4">
                  <SemiboldTitle className="text-light-900">Withdrawal</SemiboldTitle>
                </div>

                <div className="w-full text-center justify-center flex flex-col items-center">
                  <SemiboldHeader3 className="text-light-700 border-b-[0.5px] border-light-400">
                    {numeral(withdrawalDetails?.amount).format('0,0')} SATS
                  </SemiboldHeader3>

                  <SemiboldBody className="text-secondary-700 mt-2 uppercase">
                    {renderPrice({
                      amount: fiatAmount,
                      currency: userCurrency?.value === 'sats' ? 'usd' : userCurrency?.value
                    })}
                  </SemiboldBody>
                </div>
              </div>

              <div className="w-full rounded-lg px-3 md:px-4 py-3 md:py-4">
                <Tabs
                  tabs={[
                    {
                      label: 'Details',
                      content: (
                        <div className="w-full mt-3 pt-3 flex flex-col gap-5">
                          <WithdrawalDetailsItem
                            label="Wallet ID"
                            value={withdrawalDetails?.wallet_id}
                          />

                          <WithdrawalDetailsItem
                            label="Amount"
                            value={`${numeral(withdrawalDetails?.amount).format('0,0')} SATS`}
                          />

                          <WithdrawalDetailsItem
                            label="Recipient"
                            value={withdrawalDetails?.invoice}
                          />

                          <WithdrawalDetailsItem
                            label="Transaction Fee"
                            value={`${numeral(withdrawalDetails?.fees_paid / 1000).format(
                              '0,0'
                            )} SATS`}
                          />

                          <WithdrawalDetailsItem
                            label="Date"
                            value={formatDate(new Date().toISOString())}
                          />
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="overflow-auto h-full w-full">
              <form noValidate onSubmit={formik.handleSubmit}>
                <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                  <div className="mb-2 pb-2 flex flex-col gap-2">
                    <DarkInput
                      label="Destination Address or Invoice"
                      handleChange={(event) => handleDestinationChange(event.target.value)}
                      name="recipient"
                      errors={formik.errors}
                      touched={formik.touched}
                      placeholder="Bitcoin, Lightning address, or Invoice"
                      value={formik.values.recipient}
                      showLabel
                      required
                      endIcon={
                        <button
                          className="h-10 w-10 rounded-lg cursor-pointer bg-primary-200 hover:bg-primary-100 flex items-center justify-center"
                          onClick={async (event) => {
                            event.preventDefault();
                            await pasteToClipboard({
                              callback: (text: string) => {
                                handleDestinationChange(text);
                              }
                            });
                          }}>
                          <PasteIcon />
                        </button>
                      }
                    />

                    {paymentType && (
                      <div className="w-full flex items-center gap-4 justify-center text-center mt-1 pt-1">
                        <SemiboldBody className="text-secondary-700 capitalize">
                          {paymentType}
                        </SemiboldBody>

                        <Image
                          width={20}
                          height={20}
                          src={
                            paymentType === 'lightning'
                              ? '/currencies/sats.svg'
                              : '/currencies/btc.svg'
                          }
                          alt={paymentType}
                        />
                      </div>
                    )}
                  </div>

                  <div className="my-8 h-[0.5px] w-full bg-light-400" />

                  <div className="mb-2 pb-2 flex flex-col gap-2">
                    <WithdrawalAmount
                      label="Enter Amount"
                      handleChange={formik.handleChange}
                      ref={inputRef}
                      name="amount"
                      errors={formik.errors}
                      touched={formik.touched}
                      value={formik.values.amount}
                      placeholder="0"
                      disabled={isInputDisabled}
                      showLabel
                      required
                      currency={currency}
                      suffix={
                        <div>
                          <MediumHeader5 className="text-light-500 uppercase">
                            {currency}
                          </MediumHeader5>
                        </div>
                      }
                    />

                    <div className="w-full justify-between items-center flex mt-1 pt-1">
                      <SemiboldSmallText className="text-light-700">
                        Bal: {numeral(balance).format('0,0')} SATS
                      </SemiboldSmallText>

                      <div className="items-center gap-3 flex">
                        {currency === 'btc' ? (
                          <SemiboldTitle className="text-secondary-700 uppercase">
                            <span className="mr-2">
                              {numeral(btcToSats(Number(formik.values.amount))).format('0')}
                            </span>
                            SATS
                          </SemiboldTitle>
                        ) : (
                          <SemiboldTitle className="text-secondary-700 uppercase">
                            <span className="mr-2">
                              {numeral(satsToBTC(Number(formik.values.amount))).format(
                                '0,0.00000000'
                              )}
                            </span>
                            BTC
                          </SemiboldTitle>
                        )}

                        <button
                          className="cursor-pointer border-[0.5px] border-light-300 hover:border-light-400 p-1 rounded-md"
                          onClick={toggleCurrency}>
                          <RefreshIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-6 fixed bottom-4 md:bottom-10 left-2 md:left-6 right-2 md:right-6 px-6">
                  <div className="mt-6 flex px-3 py-3 rounded-lg bg-[#363121] gap-3 lg:gap-6 w-full">
                    <Image src="/icons/info.svg" alt="bitcoin" width={22} height={22} />

                    <div className="block">
                      <SemiboldBody className="text-[#f2dc9f] font-medium">
                        Ensure that the address is correct to avoid loss of funds. Transactions
                        cannot be cancelled after they are confirmed.
                      </SemiboldBody>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 w-full rounded-lg px-2 lg:px-0">
                    <PrimaryButton
                      className="w-full h-12"
                      loading={formik.isSubmitting}
                      type="submit"
                      disabled={!formik.values.amount || !formik.values.recipient}>
                      Generate Invoice
                    </PrimaryButton>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

interface WithdrawalAmountProps extends HTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  placeholder?: string;
  touched?: FormikTouched<Record<string, unknown>>;
  errors?: FormikErrors<Record<string, string>>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  showLabel?: boolean;
  required?: boolean;
  currency: CurrencyType;
  suffix: ReactNode;
  disabled?: boolean;
}

export interface WithdrawalAmountHandle {
  format: () => void;
}

const WithdrawalAmount = forwardRef<WithdrawalAmountHandle, WithdrawalAmountProps>(
  (
    {
      label,
      name,
      placeholder,
      touched,
      errors,
      handleChange,
      value,
      showLabel = false,
      required,
      currency,
      suffix,
      disabled
    },
    ref
  ) => {
    const showError =
      touched?.[name as keyof typeof touched] && errors?.[name as keyof typeof errors];

    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      const input = event.target.value.replace(/,/g, '');
      if (currency === 'btc' && input) {
        const numeric = parseFloat(input);
        if (!isNaN(numeric)) {
          const formatted = numeric.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8
          });
          inputRef.current!.value = formatted;
        }
      }

      if (currency === 'sats' && input) {
        const formatted = Number(input).toLocaleString();
        inputRef.current!.value = formatted;
      }
    };

    const handleFormattedChange = (event: ChangeEvent<HTMLInputElement>) => {
      const rawInput = event.target.value;
      const input = rawInput.replace(/,/g, '');
      const isEmpty = input === '';

      if (currency === 'sats') {
        if (!/^\d*$/.test(input)) return;
        const numericValue = Number(input);
        if (isNaN(numericValue) || numericValue > 1_000_000_000) return;

        handleChange({
          ...event,
          target: {
            ...event.target,
            value: input,
            name
          }
        });
        return;
      }

      if (currency === 'btc') {
        if (!/^\d*(\.\d{0,8})?$/.test(input)) return;

        if (!isEmpty) {
          const numericValue = parseFloat(input);
          if (!isNaN(numericValue) && numericValue > 10) return;
        }

        handleChange({
          ...event,
          target: {
            ...event.target,
            value: input,
            name
          }
        });
        return;
      }
    };

    useImperativeHandle(ref, () => ({
      format: () => {
        const inputEl = inputRef.current;
        if (!inputEl) return;

        const event = {
          target: {
            value,
            name
          }
        } as ChangeEvent<HTMLInputElement>;

        handleChange(event);
      }
    }));

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
            ref={inputRef}
            value={value}
            name={name}
            required={required}
            onChange={handleFormattedChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            type="text"
            disabled={disabled}
            inputMode={currency === 'btc' ? 'decimal' : 'numeric'}
            className={clsx(
              'border-[1px] rounded-md py-3.5 px-4 font-bold text-3xl! w-full bg-dark h-22 pr-22 text-right',
              'placeholder:text-light-500 text-light-900 disabled:text-light-500 focus:outline-none',
              {
                'border-red-700 focus:border-red-700 hover:border-red-700': showError,
                'border-light-400 focus:hover:border-primary-500 hover:hover:border-primary-500':
                  !showError
              }
            )}
          />

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">{suffix}</div>
        </div>

        {showError && (
          <RegularSmallerText className="pt-1 text-red-700">
            {errors[name as keyof typeof errors]}
          </RegularSmallerText>
        )}
      </div>
    );
  }
);

WithdrawalAmount.displayName = 'WithdrawalAmount';

export const WithdrawalDetailsItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      <div className="w-full sm:max-w-2/3 text-start sm:text-end flex flex-wrap items-center gap-2 break-words overflow-visible md:justify-end">
        <SemiboldBody className="break-words overflow-visible w-full">{value}</SemiboldBody>
      </div>
    </div>
  );
};

const TODAY = 'Today';
const YESTERDAY = 'Yesterday';
const THIS_MONTH = 'This Month';
const THIS_YEAR = 'This Year';
const ALL_TIME = 'All Time';
const CUSTOM = 'Custom';

const options = [
  {
    label: TODAY,
    func: getToday
  },
  {
    label: YESTERDAY,
    func: getYesterday
  },
  {
    label: THIS_MONTH,
    func: getThisMonth
  },
  {
    label: THIS_YEAR,
    func: getThisYear
  },
  {
    label: ALL_TIME,
    func: getAllTime
  },
  {
    label: CUSTOM
  }
];

export const WalletTransactionsFilter = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState(new Date('2024-07-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [filterCount, setFilterCount] = useState(0);
  const [dates, setDates] = useState({
    start: new Date(),
    end: new Date()
  });

  const handleDate = (key: 'start' | 'end', value: Date): void => {
    setDates({
      ...dates,
      [key]: value
    });
  };

  return (
    <div className="flex items-center">
      <div>
        <div className="flex items-center gap-2 bg-outlined border-outlined px-4 py-3 rounded-lg cursor-pointer text-light-700 hover:text-light-900 bg-light-overlay-50">
          <FilterIcon />

          {type === CUSTOM ? (
            <div className="flex items-center gap-2">
              <MediumSmallText className="text-inherit font-medium">
                {formatDate(startDate?.toString(), 'MMM DD, YYYY')}
              </MediumSmallText>
              <MediumSmallText className="text-inherit text-base">-</MediumSmallText>
              <MediumSmallText className="text-inherit font-medium">
                {formatDate(endDate?.toString(), 'MMM DD, YYYY')}
              </MediumSmallText>
            </div>
          ) : (
            <MediumSmallText className="text-inherit font-medium capitalize">
              {type !== '' ? type : 'Select Date'}
            </MediumSmallText>
          )}
        </div>
      </div>
    </div>
  );
};
