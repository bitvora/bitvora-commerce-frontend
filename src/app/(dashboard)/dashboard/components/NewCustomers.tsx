'use client';

import {
  MediumHeader4,
  MediumSmallerText,
  SemiboldBody,
  SemiboldCaption,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import {
  getDailyNewCustomers,
  getLastSevenDaysNewCustomers,
  getLastSixMonthsNewCustomers,
  getLastThirtyDaysNewCustomers,
  getLastTwelveMonthsNewCustomers,
  getPreviousWeekNewCustomers,
  getPreviousMonthNewCustomers,
  getPreviousSixMonthsNewCustomers,
  getPreviousYearNewCustomers,
  getYesterdayNewCustomers
} from '@/app/(dashboard)/dashboard/actions';
import { LoadingIcon } from '@/components/Icons';
import { AreaChart } from '@/components/Graphs';
import { formatDate } from '@/lib/helpers';
import { useAppContext } from '@/contexts';
import { graph_periods } from '@/lib/constants';
import { Breakpoint, NewCustomerData } from '@/lib/types';
import numeral from 'numeral';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const fetchers = {
  '1D': { fetcher: getDailyNewCustomers, previousFetcher: getYesterdayNewCustomers },
  '1W': { fetcher: getLastSevenDaysNewCustomers, previousFetcher: getPreviousWeekNewCustomers },
  '1M': { fetcher: getLastThirtyDaysNewCustomers, previousFetcher: getPreviousMonthNewCustomers },
  '6M': {
    fetcher: getLastSixMonthsNewCustomers,
    previousFetcher: getPreviousSixMonthsNewCustomers
  },
  '1Y': { fetcher: getLastTwelveMonthsNewCustomers, previousFetcher: getPreviousYearNewCustomers }
};

const timeTabs = graph_periods.map((period) => ({
  ...period,
  ...fetchers[period.value]
}));

export default function NewCustomers() {
  const [graphValues, setGraphValues] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [total, setTotal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);

  const { currentTab } = useAppContext() || {};

  const selectedTab = timeTabs.find((tab) => tab.value === currentTab) || {};

  const { data, isLoading } = useQuery<NewCustomerData>({
    queryKey: [`new-customers-${currentTab}`],
    queryFn: selectedTab?.fetcher
  });

  const { data: previousData, isLoading: isPreviousLoading } = useQuery<NewCustomerData>({
    queryKey: [`previous-new-customers-${currentTab}`],
    queryFn: selectedTab?.previousFetcher,
    enabled: !!selectedTab?.previousFetcher
  });

  useEffect(() => {
    if (!isLoading && data?.data) {
      setTotal(data.data.total_count || 0);
      setGraphValues(data.data.data_points.map((point) => point.count));
      setGraphLabels(data.data.data_points.map((point) => point.date));
    }
  }, [data, isLoading, currentTab]);

  useEffect(() => {
    if (!isPreviousLoading && previousData?.data) {
      setPreviousTotal(previousData.data.total_count || 0);
    }
  }, [previousData, isPreviousLoading]);

  const difference = useMemo(() => {
    return previousTotal > 0 ? (total - previousTotal) / previousTotal : 0;
  }, [previousTotal, total]);

  const labelFormatter = (value) => {
    switch (currentTab) {
      case '1W':
        return formatDate(value, 'ddd, MMM DD YYYY');
      case '1M':
        return formatDate(value, 'MMM DD YYYY');
      case '6M':
      case '1Y':
        return formatDate(value, 'MMM YYYY');
      default:
        return formatDate(value, 'hh:mm a');
    }
  };

  const breakpoint = useBreakpoint();
  const maxTicks = useMemo(() => {
    const ticksMap: Record<Breakpoint, number | undefined> = {
      base: undefined,
      sm: undefined,
      md: 3,
      lg: 3,
      xl: 3,
      '2xl': 3
    };

    return ticksMap[breakpoint];
  }, [breakpoint]);

  const text = useMemo(() => {
    switch (currentTab) {
      case '1W':
        return 'from last week';
      case '1M':
        return 'from last month';
      case '6M':
        return 'from six months ago';
      case '1Y':
        return 'from last year';
      default:
        return 'from yesterday';
    }
  }, [currentTab]);

  return (
    <div className="bg-primary-50 rounded-lg px-4 xl:px-8 py-6 xl:py-8 w-full flex flex-col gap-1 xl:gap-4 items-start justify-between h-full flex-1">
      <div className="w-full">
        <SemiboldBody className="text-light-700 hidden xl:flex">New Customers</SemiboldBody>
        <MediumSmallerText className="text-light-700 xl:hidden">New Customers</MediumSmallerText>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-1 xl:gap-6 xl:items-center">
        <MediumHeader4 className="text-light-900">{numeral(total).format('0,0')}</MediumHeader4>

        {difference !== 0 && (
          <div
            className={clsx('inline-flex items-center gap-3 h-6 px-2 rounded-sm w-fit', {
              'text-green-700 bg-green-50': difference > 0,
              'text-red-700 bg-red-50': difference < 0,
              'text-light-700': difference === 0
            })}>
            <FontAwesomeIcon icon={difference > 0 ? faCaretUp : faCaretDown} />
            <SemiboldSmallText className="text-inherit hidden xl:flex">
              {previousTotal > 0 ? (difference * 100).toFixed(2) : '0.00'}%
            </SemiboldSmallText>

            <SemiboldSmallerText className="text-inherit xl:hidden">
              {previousTotal > 0 ? (difference * 100).toFixed(2) : '0.00'}%
            </SemiboldSmallerText>
          </div>
        )}

        <SemiboldCaption className="text-light-700 xl:hidden mt-2">{text}</SemiboldCaption>
      </div>

      <div className="w-full h-[250px] lg:h-[300px] hidden xl:flex">
        {isLoading ? (
          <div className="w-full flex items-center justify-center h-[200px]">
            <LoadingIcon />
          </div>
        ) : (
          <AreaChart
            data={graphValues}
            labels={graphLabels}
            label="New Customers"
            labelFormatter={labelFormatter}
            showYAxisLabel={false}
            maxXTicks={maxTicks}
            height={250}
            width={250}
          />
        )}
      </div>
    </div>
  );
}
