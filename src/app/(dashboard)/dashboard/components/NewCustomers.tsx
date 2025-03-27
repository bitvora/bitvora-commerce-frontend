'use client';

import { MediumHeader5, SemiboldBody, SemiboldSmallText } from '@/components/Text';
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
import { useAppContext } from '@/app/contexts';
import { graph_periods } from '@/lib/constants';
import { NewCustomerData } from '@/lib/types';
import numeral from 'numeral';

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
    queryKey: [currentTab],
    queryFn: selectedTab?.fetcher
  });

  const { data: previousData, isLoading: isPreviousLoading } = useQuery<NewCustomerData>({
    queryKey: [`previous-${currentTab}`],
    queryFn: selectedTab?.previousFetcher,
    enabled: !!selectedTab?.previousFetcher
  });

  useEffect(() => {
    if (!isLoading && data?.data) {
      setTotal(data.data.total_amount || 0);
      setGraphValues(data.data.data_points.map((point) => point.amount));
      setGraphLabels(
        data.data.data_points.map((point) => point.date || point.month || point.timestamp)
      );
    }
  }, [data, isLoading, currentTab]);

  useEffect(() => {
    if (!isPreviousLoading && previousData?.data) {
      setPreviousTotal(previousData.data.total_amount || 0);
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

  return (
    <div className="bg-primary-50 rounded-lg px-8 py-8 w-full flex flex-col gap-4 items-start justify-between h-full">
      <div className="w-full">
        <SemiboldBody className="text-light-700">New Customers</SemiboldBody>
      </div>

      <div className="w-full flex gap-6 items-center">
        <MediumHeader5 className="text-light-900">
          {numeral(total).format('0,0')} SATS
        </MediumHeader5>

        {difference !== 0 && (
          <div
            className={clsx('flex items-center gap-3 h-6 px-2 rounded-sm', {
              'text-green-700 bg-green-50': difference > 0,
              'text-red-700 bg-red-50': difference < 0,
              'text-light-700': difference === 0
            })}>
            {difference !== 0 && (
              <FontAwesomeIcon icon={difference > 0 ? faCaretUp : faCaretDown} />
            )}
            <SemiboldSmallText className="text-inherit">
              {previousTotal > 0 ? (difference * 100).toFixed(2) : '0.00'}%
            </SemiboldSmallText>
          </div>
        )}
      </div>

      <div className="w-full h-60 lg:h-72">
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
          />
        )}
      </div>
    </div>
  );
}
