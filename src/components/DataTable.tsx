import type { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
  emptyText?: string;
}

export function DataTable({ headers, rows, emptyText = 'Tidak ada data.' }: DataTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{headers.map(header => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, idx) => (
            <tr key={idx}>{row.map((cell, cellIdx) => <td key={cellIdx}>{cell}</td>)}</tr>
          )) : (
            <tr><td colSpan={headers.length} className="empty-cell">{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
