import { useMemo, useState, ReactNode } from 'react';
import clsx from 'clsx';
import {
  MediumSmallerText,
  MediumSmallText,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { formatUUID } from '@/lib/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  className?: string;
  render?: (row: T) => ReactNode;
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
  tableHeader
}: Props<T>) {
  const headers = useMemo(
    () => [...columns.map((col) => col.header), actionColumn ? 'Actions' : ''].filter(Boolean),
    [columns, actionColumn]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, data.length);

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    return pages;
  };

  const renderCell = (col: Column<T>, row: T) => {
    if (col.accessor === 'id') {
      return (
        <SemiboldSmallerText className="text-light-700">
          {formatUUID(String(row[col.accessor]))}
        </SemiboldSmallerText>
      );
    }
    if (col.render) {
      return <SemiboldSmallText>{col.render(row)}</SemiboldSmallText>;
    }
    return <SemiboldSmallText>{row[col.accessor]?.toString() || ''}</SemiboldSmallText>;
  };

  const TableSkeleton = () => {
    return (
      <>
        {Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={clsx('px-6 py-4 text-sm', col.className)}>
                <div className="h-4 bg-light-300 rounded w-full"></div>
              </td>
            ))}
            {actionColumn && (
              <td className="px-6 py-4 text-sm">
                <div className="h-4 bg-light-300 rounded w-full"></div>
              </td>
            )}
          </tr>
        ))}
      </>
    );
  };

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
                  index === headers.length - 1 && 'rounded-r-md'
                )}>
                <SemiboldSmallText className="text-inherit capitalize">{header}</SemiboldSmallText>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-transparent divide-y divide-light-200 mt-4">
          {isLoading ? (
            <TableSkeleton />
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-light-overlay-50 cursor-pointer"
                onClick={() => rowOnClick?.(row)}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={clsx('px-6 py-4 text-sm', col.className)}>
                    {renderCell(col, row)}
                  </td>
                ))}
                {actionColumn && <td className="px-6 py-4 text-sm">{actionColumn(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-end items-center p-4 gap-8">
          <div className="flex items-center gap-2">
            <MediumSmallText className="text-light-700">
              {startItem}-{endItem}
            </MediumSmallText>

            <MediumSmallerText className="text-light-500">of</MediumSmallerText>

            <MediumSmallText className="text-light-700">{data.length}</MediumSmallText>
          </div>

          <div className="flex gap-2">
            {currentPage !== 1 && (
              <button
                className={clsx(
                  'h-8 w-8 rounded-md bg-transparent border-[0.5px] border-light-200 flex justify-center text-center items-center cursor-pointer text-light-500 hover:text-light-700 hover:bg-light-overlay-100'
                )}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={clsx(
                  'px-4 py-2 rounded-md h-8 w-8 flex justify-center text-center items-center cursor-pointer',
                  {
                    'bg-light-overlay-50 text-light-700': page === currentPage,
                    'bg-transparent text-light-700 hover:bg-light-overlay-50': page !== currentPage
                  }
                )}
                onClick={() => setCurrentPage(page)}>
                <MediumSmallText>{page}</MediumSmallText>
              </button>
            ))}

            {currentPage !== totalPages && (
              <button
                className={clsx(
                  'h-8 w-8 rounded-md bg-transparent border-[0.5px] border-light-200 flex justify-center text-center items-center cursor-pointer text-light-500 hover:text-light-700 hover:bg-light-overlay-100'
                )}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
