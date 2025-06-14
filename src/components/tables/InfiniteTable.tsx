'use client';

import { SemiboldSmallerText, SemiboldSmallText } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { ReactNode, useCallback } from 'react';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

type Column<T> = {
  header: string;
  accessor: keyof T;
  hiddenOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  className?: string;
  render?: (row: T) => ReactNode;
};

type InfiniteTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  offset: number;
  limit: number;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
  actionColumn?: (row: T) => ReactNode;
  emptyMessage?: string;
  rowOnClick?: (row: T) => void;
  tableContainerClassName?: string;
  tableHeader?: ReactNode;
};

function InfiniteTable<T>({
  columns,
  data,
  offset,
  limit,
  onNext,
  onPrevious,
  isLoading,
  actionColumn,
  emptyMessage = 'No data available',
  rowOnClick,
  tableContainerClassName,
  tableHeader
}: InfiniteTableProps<T>) {
  const handleRowClick = useCallback(
    (row: T) => {
      if (rowOnClick) rowOnClick(row);
    },
    [rowOnClick]
  );

  const renderCell = useCallback((col: Column<T>, row: T) => {
    return col.render ? (
      col.render(row)
    ) : (
      <SemiboldSmallText className="text-inherit">
        {row[col.accessor]?.toString() || ''}
      </SemiboldSmallText>
    );
  }, []);

  const buttonClass =
    'h-8 w-8 rounded-md flex justify-center items-center border-[0.5px] border-light-200';

  return (
    <div
      className={clsx(
        'overflow-x-auto w-full bg-primary-50 shadow-sm rounded-lg flex flex-col gap-8 h-full px-8 py-6',
        tableContainerClassName
      )}>
      {tableHeader}

      <table className="w-full min-w-full border-separate border-spacing-y-2 rounded-lg">
        <thead className="h-12 bg-light-overlay-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.accessor)}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider',
                  index === 0 && 'rounded-l-md',
                  index === columns.length - 1 && 'rounded-r-md',
                  column.hiddenOn?.includes('sm') && 'hidden sm:table-cell'
                )}>
                <SemiboldSmallText className="text-inherit capitalize hidden md:flex">
                  {column.header}
                </SemiboldSmallText>

                <SemiboldSmallerText className="truncate capitalize md:hidden text-inherit">
                  {column.header}
                </SemiboldSmallerText>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-transparent divide-y divide-light-200 mt-4">
          {isLoading ? (
            Array.from({ length: limit }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={clsx(
                      'px-6 py-4 text-sm',
                      col.className,
                      col.hiddenOn?.map((bp) => `hidden ${bp}:table-cell`).join(' ')
                    )}>
                    <div className="h-4 bg-light-300 rounded w-full"></div>
                  </td>
                ))}
                {actionColumn && (
                  <td className="px-6 py-4 text-sm">
                    <div className="h-4 bg-light-300 rounded w-full"></div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-light-900">
                    <SemiboldSmallText className="text-inherit">{emptyMessage}</SemiboldSmallText>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} onClick={() => handleRowClick(row)} className="group">
                    {columns.map((col, index) => (
                      <td
                        key={index}
                        className={clsx(
                          'px-6 py-4 text-sm border-light-300 cursor-pointer border-b-[1px] group-hover:border-b-[1px] group-hover:border-primary-600 transition duration-200 text-light-700 group-hover:text-light-900',
                          col.className,
                          col.hiddenOn?.map((bp) => `hidden ${bp}:table-cell`).join(' ')
                        )}>
                        {renderCell(col, row)}
                      </td>
                    ))}

                    {actionColumn && (
                      <td
                        className="px-6 py-4 text-sm border-light-300 cursor-pointer border-b-[1px] 
                                   group-hover:border-b-[1px] group-hover:border-primary-600 
                                   transition duration-200 hidden sm:table-cell">
                        {actionColumn(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </>
          )}
        </tbody>
      </table>

      <div className="flex justify-end items-center p-4 gap-8">
        <div className="flex gap-2 items-center">
          <button
            onClick={onPrevious}
            disabled={offset === 0}
            className={clsx(buttonClass, 'text-light-500', {
              'opacity-50 cursor-not-allowed': offset === 0,
              'hover:text-light-700 hover:bg-light-overlay-100': offset > 0
            })}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          <button
            onClick={onNext}
            disabled={data.length < limit}
            className={clsx(
              buttonClass,
              'text-light-500 hover:text-light-700 hover:bg-light-overlay-100',
              {
                'opacity-50 cursor-not-allowed': data.length < limit,
                'hover:text-light-700 hover:bg-light-overlay-100': data.length > limit
              }
            )}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfiniteTable;
