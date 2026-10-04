const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;
const WEEKS_BEFORE_MONTH = 4;
const MONTHS_IN_YEAR = 12;
const LOCALE = 'en-US';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' });

function ago(count: number, unit: string): string {
  return `${String(count)} ${unit}${count === 1 ? '' : 's'} ago`;
}

// "2026-10-01T10:00:00Z" => "3 days ago". The units follow the task:
// just now, 1-59 min, 1-23 hours, 1-6 days, 1-3 weeks, 1-11 months, then years
export function formatRelativeTime(isoDate: string, now = Date.now()): string {
  const time = Date.parse(isoDate);

  if (Number.isNaN(time)) {
    return '';
  }

  // A date from the future (clock difference) is shown as "just now"
  const elapsed = Math.max(0, now - time);
  const minutes = Math.floor(elapsed / MINUTE);

  if (minutes < 1) {
    return 'just now';
  }

  const hours = Math.floor(elapsed / HOUR);

  if (hours < 1) {
    return `${String(minutes)} min ago`;
  }

  const days = Math.floor(elapsed / DAY);

  if (days < 1) {
    return ago(hours, 'hour');
  }

  const weeks = Math.floor(days / DAYS_IN_WEEK);

  if (weeks < 1) {
    return ago(days, 'day');
  }

  if (weeks < WEEKS_BEFORE_MONTH) {
    return ago(weeks, 'week');
  }

  const months = Math.min(Math.max(Math.floor(days / DAYS_IN_MONTH), 1), MONTHS_IN_YEAR - 1);
  const years = Math.floor(days / DAYS_IN_YEAR);

  return years < 1 ? ago(months, 'month') : ago(years, 'year');
}

// "2026-08-28T14:30:00Z" => "Aug 28, 2026"
export function formatDate(isoDate: string): string {
  const time = Date.parse(isoDate);

  return Number.isNaN(time) ? '' : dateFormatter.format(time);
}
