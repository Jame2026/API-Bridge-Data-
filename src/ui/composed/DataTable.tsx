import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-[#8083ff] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#908fa0] font-mono">Loading data records...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-[#908fa0] text-xs font-mono border border-dashed border-[#262a33] rounded-xl">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-[#262a33] rounded-xl bg-[#141822]">
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-[#262a33] bg-[#181c24]/80 text-[#908fa0] uppercase tracking-wider text-[10px]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3 px-4 font-semibold ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262a33]">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="hover:bg-[#181c24]/50 transition-colors text-[#dfe2ee]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
