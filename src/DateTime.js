export default class DateTime {

  static leapYear (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  static getMonthLength (year, month) {
    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
  }

  static getTimeBethwen (begin, end) {
    return end.getTime() - begin.getTime();
  }

  static toSeconds (milliseconds) {
    return milliseconds / 1000;
  }

  static toMinutes (milliseconds) {
    return milliseconds / 60000;
  }

  static toHours (milliseconds) {
    return milliseconds / 3600000;
  }

  static toDays (milliseconds) {
    return milliseconds / 86400000;
  }

  static toWeeks (milliseconds) {
    return milliseconds / 604800000;
  }

  static dayToName (day) {
    switch (day) {
    case 0:
      return 'Вс';
    case 1:
      return 'Пн';
    case 2:
      return 'Вт';
    case 3:
      return 'Ср';
    case 4:
      return 'Чт';
    case 5:
      return 'Пт';
    case 6:
      return 'Сб';
    }
  }

  static getPartionSize (partion) {
    switch (partion) {
    case 'minutes':
      return 60000;
    case 'hours':
      return 3600000;
    case 'days':
      return 86400000;
    case 'weeks':
      return 604800000;
    }
  }

  constructor (begin) {
    this.year = begin.getFullYear();
    this.month = begin.getMonth() + 1; // 1-12
    this.week = 1; // 1 - ...
    this.date = begin.getDate(); // 1-31
    this.hours = begin.getHours(); // 0-23
    this.minutes = begin.getMinutes(); // 0-59

    const day = begin.getDay();
    this.day = day > 0 ? day : 7; // 1-7 from monday
  }

  before (date) {
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

  after (date) {
    if (
      this.year > date.getFullYear()
      || (this.year === date.getFullYear() && this.month > date.getMonth() + 1)
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1 && this.date > date.getDate())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours > date.getHours())
      || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
        && this.date === date.getDate() && this.hours === date.getHours() && this.minutes >= date.getMinutes())
    ) {
      return true;
    }
    return false;
  }

  isToday (date) {
    return (this.date === date.getDate()) && (this.month === date.getMonth() + 1) && (this.year === date.getFullYear());
  }

  next (level) {
    this.addMinute(level);
    return this;
  }

  toDate () {
    return new Date(this.year, this.month - 1, this.date, this.hours, this.minutes);
  }

  toTime () {
    return this.toDate().getTime();
  }

  toString () {
    return `${this.year} ${this.month} ${this.date} ${this.hours} ${this.minutes}`;
  }

  addYear (level) {
    this.year++;
    level('years', this);
  }

  addMonth (level) {
    if (this.month < 12) {
      this.month++;
    } else {
      this.month = 1;
      this.addYear(level);
    }
    level('months', this);
  }

  addDate (level) {
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
    level('date', this);
  }

  addHours (level) {
    if (this.hours < 23) {
      this.hours++;
    } else {
      this.hours = 0;
      this.addDate(level);
    }
    level('hours', this);
  }

  addMinute (level) {
    if (this.minutes < 59) {
      this.minutes++;
    } else {
      this.minutes = 0;
      this.addHours(level);
    }
    level('dateTime', this);
    level('minutes', this);
  }

}
