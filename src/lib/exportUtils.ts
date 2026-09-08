/**
 * Export and Reporting Utilities
 * Generates clean CSV files for Excel/Sheets and prepares formatted PDF reports.
 */

export function exportToCsv(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Extract all unique headers
  const headers = Array.from(
    new Set(rows.flatMap(row => Object.keys(row)))
  );

  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  // Header row
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // Data rows
  for (const row of rows) {
    const values = headers.map(header => escapeCell(row[header]));
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\r\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers the browser's native print dialogue with styles tuned for PDF export.
 */
export function printReportPdf(): void {
  window.print();
}
