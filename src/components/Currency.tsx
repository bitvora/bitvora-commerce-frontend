/* eslint-disable @next/next/no-img-element */
'use client';

import { SemiboldSmallerText, SemiboldSmallText } from '@/components/Text';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@/components/Inputs';
import { useAppContext } from '@/app/providers';
import { CurrencyType } from '@/lib/types';
import { currencies } from '@/lib/constants';
import Dropdown from '@/components/Dropdown';

export default function Currency() {
  const { currency, updateCurrency } = useAppContext();

  const handleSelection = (value: CurrencyType) => {
    updateCurrency(value);
  };

  return (
    <Dropdown
      onSelectClose={true}
      trigger={
        <>
          <SemiboldSmallerText className="text-inherit hidden md:flex">
            Currency:
          </SemiboldSmallerText>
          {currency && (
            <div className="flex items-center gap-2">
              <img src={currency.image} alt={currency.label} className="h-4 w-5 rounded-sm" />

              <FontAwesomeIcon icon={faCaretDown} className="h-4 w-4" />
            </div>
          )}
        </>
      }
      content={
        <div className="flex flex-col">
          <div className="px-7 py-5 border-light-400 border-b-[1px]">
            <SemiboldSmallText>Currency</SemiboldSmallText>
          </div>

          <div className="px-3 py-1">
            {currency && (
              <RadioGroup<CurrencyType>
                name="currency"
                options={currencies.map((cur) => ({
                  value: cur,
                  label: (
                    <div className="flex items-center gap-4">
                      <img src={cur.image} alt={cur.label} className="h-4 w-5" />
                      <SemiboldSmallerText className="text-inherit">
                        {cur.label}
                      </SemiboldSmallerText>
                    </div>
                  )
                }))}
                defaultValue={currency}
                onChange={handleSelection}
              />
            )}
          </div>
        </div>
      }
      className="w-full max-w-[70px] md:max-w-[200px]"
      contentClass="w-[240px]"
      buttonClass="w-full flex justify-between gap-4 items-center bg-[#2b2731] h-8 rounded-3xl px-4 border-none outline-none text-light-900 cursor-pointer hover:text-light-800"
    />
  );
}
