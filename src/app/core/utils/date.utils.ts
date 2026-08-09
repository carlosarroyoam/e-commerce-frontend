const DEFAULT_LOCALE = 'es-MX';

export const formatDateTime = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};

export const formatDate = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};

export const formatTime = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};
