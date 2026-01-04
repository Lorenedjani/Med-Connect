import moment from 'moment';

export class DateUtil {
  static formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    return moment(date).format(format);
  }

  static formatDateTime(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment(date).format(format);
  }

  static addDays(date: Date | string, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }

  static addHours(date: Date | string, hours: number): Date {
    return moment(date).add(hours, 'hours').toDate();
  }

  static addMinutes(date: Date | string, minutes: number): Date {
    return moment(date).add(minutes, 'minutes').toDate();
  }

  static subtractDays(date: Date | string, days: number): Date {
    return moment(date).subtract(days, 'days').toDate();
  }

  static isAfter(date1: Date | string, date2: Date | string): boolean {
    return moment(date1).isAfter(date2);
  }

  static isBefore(date1: Date | string, date2: Date | string): boolean {
    return moment(date1).isBefore(date2);
  }

  static isSame(date1: Date | string, date2: Date | string, unit: string = 'day'): boolean {
    return moment(date1).isSame(date2, unit as any);
  }

  static getDifference(date1: Date | string, date2: Date | string, unit: string = 'days'): number {
    return moment(date1).diff(date2, unit as any);
  }

  static isValidDate(date: any): boolean {
    return moment(date).isValid();
  }

  static parseDate(date: string, format?: string): Date | null {
    const parsed = format ? moment(date, format) : moment(date);
    return parsed.isValid() ? parsed.toDate() : null;
  }

  static getStartOfDay(date: Date | string): Date {
    return moment(date).startOf('day').toDate();
  }

  static getEndOfDay(date: Date | string): Date {
    return moment(date).endOf('day').toDate();
  }

  static getStartOfWeek(date: Date | string): Date {
    return moment(date).startOf('week').toDate();
  }

  static getEndOfWeek(date: Date | string): Date {
    return moment(date).endOf('week').toDate();
  }

  static getRelativeTime(date: Date | string): string {
    return moment(date).fromNow();
  }

  static getBusinessDays(date1: Date | string, date2: Date | string): number {
    const start = moment(date1);
    const end = moment(date2);
    let businessDays = 0;

    const current = start.clone();
    while (current.isSameOrBefore(end)) {
      if (current.day() !== 0 && current.day() !== 6) { // Not Sunday (0) or Saturday (6)
        businessDays++;
      }
      current.add(1, 'days');
    }

    return businessDays;
  }

  static isWeekend(date: Date | string): boolean {
    const day = moment(date).day();
    return day === 0 || day === 6;
  }

  static getTimezoneOffset(): number {
    return new Date().getTimezoneOffset();
  }

  static toISOString(date: Date | string): string {
    return moment(date).toISOString();
  }
}
