import { useMemo, useState, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import {
  MediumSmallerText,
  MediumSmallText,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  className?: string;
  render?: (row: T) => ReactNode;
  hiddenOn?: ('sm' | 'md' | 'lg' | 'xl')[];
}

interface Props<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowsPerPage?: number;
  rowOnClick?: (row: T) => void;
  actionColumn?: (row: T) => ReactNode;
  tableContainerClassName?: string;
  tableHeader: ReactNode;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  rowsPerPage = 10,
  rowOnClick,
  actionColumn,
  tableContainerClassName,
  tableHeader,
  currentPage: externalCurrentPage,
  onPageChange
}: Props<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = externalCurrentPage ?? internalPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const setCurrentPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const headers = useMemo(
    () =>
      [
        ...columns.map((col) => ({ label: col.header, hiddenOn: col.hiddenOn })),
        actionColumn ? { label: 'Actions', hiddenOn: ['sm'] } : null
      ].filter(Boolean),
    [columns, actionColumn]
  );

  const getPageNumbers = useMemo(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: number[] = [];
    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    return pages;
  }, [currentPage, totalPages]);

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
    'h-8 w-8 rounded-md flex justify-center items-center cursor-pointer border-[0.5px] border-light-200';

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
            {headers.map((header, index) => (
              <th
                key={index}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider',
                  index === 0 && 'rounded-l-md',
                  index === headers.length - 1 && 'rounded-r-md',
                  header.hiddenOn?.includes('sm') && 'hidden sm:table-cell'
                )}>
                <SemiboldSmallText className="text-inherit capitalize hidden md:flex">
                  {header.label}
                </SemiboldSmallText>

                <SemiboldSmallerText className="truncate capitalize md:hidden text-inherit">
                  {header.label}
                </SemiboldSmallerText>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-transparent divide-y divide-light-200 mt-4">
          {isLoading ? (
            Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
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
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
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
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-light-900">
                <SemiboldSmallText className="text-inherit">{emptyMessage}</SemiboldSmallText>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-end items-center p-4 gap-8">
          <div className="flex items-center gap-2">
            <MediumSmallText className="text-light-700">
              {(currentPage - 1) * rowsPerPage + 1} -
              {Math.min(currentPage * rowsPerPage, data.length)}
            </MediumSmallText>
            <MediumSmallerText className="text-light-500">of</MediumSmallerText>
            <MediumSmallText className="text-light-700">{data.length}</MediumSmallText>
          </div>

          <div className="flex gap-2">
            {currentPage > 1 && (
              <button
                className={clsx(
                  buttonClass,
                  'text-light-500 hover:text-light-700 hover:bg-light-overlay-100'
                )}
                onClick={() => setCurrentPage(currentPage - 1)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}

            {getPageNumbers.map((page) => (
              <button
                key={page}
                className={clsx(buttonClass, {
                  'bg-light-overlay-50 text-light-700': page === currentPage,
                  'text-light-700 hover:bg-light-overlay-50': page !== currentPage
                })}
                onClick={() => setCurrentPage(page)}>
                <MediumSmallText>{page}</MediumSmallText>
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                className={clsx(
                  buttonClass,
                  'text-light-500 hover:text-light-700 hover:bg-light-overlay-100'
                )}
                onClick={() => setCurrentPage(currentPage + 1)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
