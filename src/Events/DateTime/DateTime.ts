export default class DateTime {

  public static leapYear (year): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  public static getMonthLength (year: number, month: number) {
    // tslint:disable-next-line:no-bitwise
    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
  }

  public static getTimeBethwen (begin: Date, end: Date) {
    return end.getTime() - begin.getTime();
  }

  public static toSeconds (milliseconds: number): number {
    return milliseconds / 1000;
  }

  public static toMinutes (milliseconds: number): number {
    return milliseconds / 60000;
  }

  public static toHours (milliseconds: number): number {
    return milliseconds / 3600000;
  }

  public static toDays (milliseconds: number): number {
    return milliseconds / 86400000;
  }

  public static toWeeks (milliseconds: number): number {
    return milliseconds / 604800000;
  }

  public year: number;
  public month: number; // 1-12
  public week: number; // 1 - ...
  public date: number; // 1-31
  public hours: number; // 0-23
  public minutes: number; // 0-59

  public day: number; // 1-7 from monday

  constructor (public begin: Date) {
    this.year = begin.getFullYear();
    this.month = begin.getMonth() + 1;
    this.week = 1;
    this.date = begin.getDate();
    this.hours = begin.getHours();
    this.minutes = begin.getMinutes() - 1;

    const day = begin.getDay();
    this.day = day > 0 ? day : 7;
  }

  public before (date: Date): boolean {
    if (
      this.year < date.getFullYear()
      || (this.year === date.getFullYear() && this.month < date.getMonth() + 1)
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1 && this.date < date.getDate())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours < date.getHours())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours === date.getHours() && this.minutes < date.getMinutes())
    ) {
      return true;
    }
    return false;
  }

  public after (date: Date): boolean {
    if (
      this.year > date.getFullYear()
      || (this.year === date.getFullYear() && this.month > date.getMonth() + 1)
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1 && this.date > date.getDate())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours > date.getHours())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours === date.getHours() && this.minutes > date.getMinutes())
    ) {
      return true;
    }
    return false;
  }

  public isToday (date: Date): boolean {
    return (this.date === date.getDate()) && (this.month === date.getMonth() + 1) && (this.year === date.getFullYear());
  }

  public next (level): DateTime {
    this.addMinute(level);
    return this;
  }

  public toDate (): Date {
    return new Date(this.year, this.month - 1, this.date, this.hours, this.minutes);
  }

  private addYear (level): void {
    this.year++;
    level('years', this);
  }

  private addMonth (level): void {
    if (this.month < 12) {
      this.month++;
    } else {
      this.month = 1;
      this.addYear(level);
    }
    level('months', this);
  }

  private addDate (level): void {
    // Day
    if (this.day < 7) {
      this.day++;
    } else {
      this.day = 1;
      this.week++;
      level('weeks', this);
    }
    // Date
    if (this.date < DateTime.getMonthLength(this.year, this.month)) {
      this.date++;
    } else {
      this.date = 1;
      this.addMonth(level);
    }
    level('days', this);
  }

  private addHours (level): void {
    if (this.hours < 23) {
      this.hours++;
    } else {
      this.hours = 0;
      this.addDate(level);
    }
    level('hours', this);
  }

  private addMinute (level): void {
    if (this.minutes < 59) {
      this.minutes++;
    } else {
      this.minutes = 0;
      this.addHours(level);
    }
    level('minutes', this);
    level('dateTime', this);
  }

}
