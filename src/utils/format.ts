const LOCALE = 'en-US';
const INITIALS_LENGTH = 2;

const numberFormatter = new Intl.NumberFormat(LOCALE);
const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

// 94250 => "94,250"
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

// 94250 => "94.3K"
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

// "Alex_Pro99" => "AP"
export function getInitials(name: string): string {
  const capitals = name.match(/[A-Z]/g) ?? [];
  const source = capitals.length >= INITIALS_LENGTH ? capitals.join('') : name;

  return source.slice(0, INITIALS_LENGTH).toUpperCase();
}
