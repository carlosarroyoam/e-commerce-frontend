export default class Utils {
  static formatDate(date: string | number | Date): string {
    const formatOptions = {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: true,
    } satisfies Intl.DateTimeFormatOptions;

    return new Intl.DateTimeFormat('es-MX', formatOptions).format(
      new Date(date),
    );
  }

  static formatTime(date: string | number | Date): string {
    const formatOptions = {
      timeStyle: 'short',
      hour12: true,
    } satisfies Intl.DateTimeFormatOptions;

    return new Intl.DateTimeFormat('es-MX', formatOptions).format(
      new Date(date),
    );
  }
}
