'use client';

import { MediumHeader5, SemiboldBody, SemiboldSmallText } from '@/components/Text';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import {
  getDailyActiveSubscribers,
  getLastSevenDaysActiveSubscribers,
  getLastSixMonthsActiveSubscribers,
  getLastThirtyDaysActiveSubscribers,
  getLastTwelveMonthsActiveSubscribers,
  getPreviousWeekActiveSubscribers,
  getPreviousMonthActiveSubscribers,
  getPreviousSixMonthsActiveSubscribers,
  getPreviousYearActiveSubscribers,
  getYesterdayActiveSubscribers
} from '@/app/(dashboard)/dashboard/actions';
import { LoadingIcon } from '@/components/Icons';
import { AreaChart } from '@/components/Graphs';
import { formatDate } from '@/lib/helpers';
import { useAppContext } from '@/app/contexts';
import { graph_periods } from '@/lib/constants';
import { ActiveSubscribersData } from '@/lib/types';
import numeral from 'numeral';

const fetchers = {
  '1D': { fetcher: getDailyActiveSubscribers, previousFetcher: getYesterdayActiveSubscribers },
  '1W': {
    fetcher: getLastSevenDaysActiveSubscribers,
    previousFetcher: getPreviousWeekActiveSubscribers
  },
  '1M': {
    fetcher: getLastThirtyDaysActiveSubscribers,
    previousFetcher: getPreviousMonthActiveSubscribers
  },
  '6M': {
    fetcher: getLastSixMonthsActiveSubscribers,
    previousFetcher: getPreviousSixMonthsActiveSubscribers
  },
  '1Y': {
    fetcher: getLastTwelveMonthsActiveSubscribers,
    previousFetcher: getPreviousYearActiveSubscribers
  }
};

const timeTabs = graph_periods.map((period) => ({
  ...period,
  ...fetchers[period.value]
}));

export default function ActiveSubscribers() {
  const [graphValues, setGraphValues] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [total, setTotal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);

  const { currentTab } = useAppContext() || {};

  const selectedTab = timeTabs.find((tab) => tab.value === currentTab) || {};

  const { data, isLoading } = useQuery<ActiveSubscribersData>({
    queryKey: [`active-subscribers-${currentTab}`],
    queryFn: () => selectedTab?.fetcher()
  });

  const { data: previousData, isLoading: isPreviousLoading } = useQuery<ActiveSubscribersData>({
    queryKey: [`previous-active-subscribers-${currentTab}`],
    queryFn: () => selectedTab?.previousFetcher(),
    enabled: !!selectedTab?.previousFetcher
  });

  console.log({ graphValues, graphLabels });

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

  return (
    <div className="bg-primary-50 rounded-lg px-8 py-8 w-full flex flex-col gap-4 items-start justify-between flex-1 h-full">
      <div className="w-full">
        <SemiboldBody className="text-light-700">Active Subscribers</SemiboldBody>
      </div>

      <div className="w-full flex gap-6 items-center">
        <MediumHeader5 className="text-light-900">{numeral(total).format('0,0')}</MediumHeader5>

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

      <div className="w-full h-[250px] lg:h-[300px]">
        {isLoading ? (
          <div className="w-full flex items-center justify-center h-[200px]">
            <LoadingIcon />
          </div>
        ) : (
          <AreaChart
            data={graphValues}
            labels={graphLabels}
            label="Active Subscribers"
            labelFormatter={labelFormatter}
            showYAxisLabel={false}
            height={250}
            width={250}
          />
        )}
      </div>
    </div>
  );
}
