import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Skeleton from './Skeleton';

export interface Column<T> {
  header: string;
  accessor: keyof T | 'actions';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowClassName?: (row: T) => string;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

const Table = <T extends { id: string | number }>({ columns, data, rowClassName, isLoading = false, skeletonRowCount = 5 }: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | 'actions'; direction: 'ascending' | 'descending' } | null>(null);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (sortConfig.key === 'actions') {
          return 0;
        }
        // After the check above, TypeScript knows sortConfig.key is of type `keyof T`.
        const key = sortConfig.key;
        const aValue = a[key];
        const bValue = b[key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T | 'actions') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const SkeletonRow = () => (
    <tr className="border-b border-border">
        {columns.map(col => (
            <td key={String(col.accessor)} className="px-4 py-3 align-middle">
                <Skeleton className="h-5 w-full" />
            </td>
        ))}
    </tr>
  );

  return (
     <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-secondary uppercase bg-background">
          <tr>
            {columns.map(col => (
              <th key={String(col.accessor)} scope="col" className="px-4 py-3">
                {col.sortable ? (
                    <button onClick={() => requestSort(col.accessor)} className="flex items-center gap-1">
                        {col.header}
                        {sortConfig?.key === col.accessor && (sortConfig.direction === 'ascending' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                ) : col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRowCount }).map((_, i) => <SkeletonRow key={i} />)
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-text-secondary">
                No data available.
              </td>
            </tr>
          ) : (
            sortedData.map((row) => {
              const customClasses = rowClassName ? rowClassName(row) : '';
              return (
                  <tr key={row.id} className={`border-b border-border transition-colors ${customClasses || 'hover:bg-background'}`}>
                      {columns.map(col => (
                          <td key={String(col.accessor)} className="px-4 py-3 align-top">
                              {col.render 
                                  ? col.render(row) 
                                  : col.accessor !== 'actions' 
                                      // After the check, TypeScript knows col.accessor is of type `keyof T`.
                                      ? String(row[col.accessor] ?? '') 
                                      : null}
                          </td>
                      ))}
                  </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
