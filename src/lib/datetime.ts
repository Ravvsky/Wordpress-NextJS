import { format } from 'date-fns';

/**
 * formatDate
 */

export function formatDate(date, pattern = 'PPP') {
  return format(new Date(date), pattern);
}

/**
 * sortObjectsByDate
 */

export function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]).valueOf() - new Date(a[key]).valueOf());
}
