'use client';

import { MediumBody, SemiboldBody, SemiboldHeader3, SemiboldSmallText } from '@/components/Text';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import {
  getDailySales,
  getLastSevenDaysSales,
  getLastSixMonthsSales,
  getLastThirtyDaysSales,
  getLastTwelveMonthsSales,
  getPreviousWeekSales,
  getPreviousMonthSales,
  getPreviousSixMonthsSales,
  getPreviousYearSales,
  getYesterdaySales
} from '@/app/(dashboard)/dashboard/actions';
import { LoadingIcon } from '@/components/Icons';
import { AreaChart } from '@/components/Graphs';
import { formatDate } from '@/lib/helpers';
import { useAppContext } from '@/app/contexts';
import { graph_periods } from '@/lib/constants';
import { SalesData } from '@/lib/types';
import numeral from 'numeral';

const fetchers = {
  '1D': { fetcher: getDailySales, previousFetcher: getYesterdaySales },
  '1W': { fetcher: getLastSevenDaysSales, previousFetcher: getPreviousWeekSales },
  '1M': { fetcher: getLastThirtyDaysSales, previousFetcher: getPreviousMonthSales },
  '6M': { fetcher: getLastSixMonthsSales, previousFetcher: getPreviousSixMonthsSales },
  '1Y': { fetcher: getLastTwelveMonthsSales, previousFetcher: getPreviousYearSales }
};

const timeTabs = graph_periods.map((period) => ({
  ...period,
  ...fetchers[period.value]
}));

export default function SalesGraph() {
  const [graphValues, setGraphValues] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [total, setTotal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);

  const { currentTab, updateCurrentTab } = useAppContext() || {};

  const selectedTab = timeTabs.find((tab) => tab.value === currentTab) || {};

  const { data, isLoading } = useQuery<SalesData>({
    queryKey: [`sales-${currentTab}`],
    queryFn: selectedTab?.fetcher
  });

  const { data: previousData, isLoading: isPreviousLoading } = useQuery<SalesData>({
    queryKey: [`previous-sales-graph-${currentTab}`],
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

  const text = useMemo(() => {
    switch (currentTab) {
      case '1W':
        return 'since last week';
      case '1M':
        return 'since last month';
      case '6M':
        return 'since six months ago';
      case '1Y':
        return 'since last year';
      default:
        return 'since yesterday';
    }
  }, [currentTab]);

  return (
    <div className="bg-primary-50 rounded-lg px-8 py-8 w-full flex items-start justify-between">
      <div className="flex flex-col gap-3 w-[300px] h-full">
        <SemiboldBody className="text-light-900">Total Sales</SemiboldBody>
        <SemiboldHeader3 className="text-light-900">
          {numeral(total).format('0,0')} SATS
        </SemiboldHeader3>

        <div className="flex items-center gap-1">
          <div
            className={clsx('flex items-center gap-1', {
              'text-green-700': difference > 0,
              'text-error-700': difference < 0,
              'text-light-700': difference === 0
            })}>
            {difference !== 0 && (
              <FontAwesomeIcon icon={difference > 0 ? faArrowUp : faArrowDown} />
            )}
            <SemiboldSmallText className="text-inherit">
              {previousTotal > 0 ? (difference * 100).toFixed(2) : '0.00'}%
            </SemiboldSmallText>
          </div>
          <SemiboldSmallText className="text-light-700">{text}</SemiboldSmallText>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center float-right justify-end ml-auto gap-1">
          {timeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateCurrentTab?.(tab.value)}
              className={clsx(
                'border-[0.5px] rounded-md cursor-pointer outline-none focus:outline-none text-light-500 h-10 w-10 px-1',
                {
                  'border-secondary-700 bg-[#221e2b] text-secondary-500': currentTab === tab.value,
                  'border-transparent bg-transparent hover:border-secondary-700':
                    currentTab !== tab.value
                }
              )}>
              <MediumBody className="text-inherit">{tab.label}</MediumBody>
            </button>
          ))}
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
              label="Total Sales"
              labelFormatter={labelFormatter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
