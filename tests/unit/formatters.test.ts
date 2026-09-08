import { formatNumber, formatDate, truncate } from '../../src/utils/formatters';

// Simple unit validation
export function runFormattersTest() {
  console.assert(formatNumber(1500) === '1.5k', 'formatNumber 1500 should be 1.5k');
  console.assert(formatNumber(2000000) === '2.0M', 'formatNumber 2M should be 2.0M');
  console.assert(formatNumber(45) === '45', 'formatNumber 45 should be 45');
  console.assert(truncate('Hello World', 5) === 'Hello...', 'truncate failed');
  return true;
}
