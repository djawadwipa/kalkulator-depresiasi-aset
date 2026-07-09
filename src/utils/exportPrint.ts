export function exportToCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const value = row[header] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ].join('\n');
  downloadBlob(filename, csv, 'text/csv;charset=utf-8;');
}

export function exportToJSON(filename: string, data: unknown): void {
  downloadBlob(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8;');
}

export function downloadBlob(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printReport(title: string): void {
  const original = document.title;
  document.title = title;
  window.print();
  setTimeout(() => {
    document.title = original;
  }, 500);
}
