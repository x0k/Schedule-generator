export default class DateTime {

  static leapYear (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  static getMonthLength (year, month) {
    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
  }

  constructor (begin) {
    this.year = begin.getFullYear();
    this.month = begin.getMonth(); // 0-11
    this.week = 0; // 0 - ...
    this.date = begin.getDate(); // 1-31
    this.hours = begin.getHours(); // 0-23
    this.minutes = begin.getMinutes(); // 0-59

    this.day = begin.getDay(); // 0-6 from monday
  }

  before (date) {
    if (
      this.year < date.getFullYear()
      || (this.year === date.getFullYear() && this.month < date.getMonth())
      || (this.year === date.getFullYear() && this.month === date.getMonth() && this.date < date.getDate())
      || (this.year === date.getFullYear() && this.month === date.getMonth()
        && this.date === date.getDate() && this.hours < date.getHours())
      || (this.year === date.getFullYear() && this.month === date.getMonth()
        && this.date === date.getDate() && this.hours === date.getHours() && this.minutes < date.getMinutes())
    ) {
      return true;
    }
    return false;
  }

  after (date) {
    if (
      this.year > date.getFullYear()
      || (this.year === date.getFullYear() && this.month > date.getMonth())
      || (this.year === date.getFullYear() && this.month === date.getMonth() && this.date > date.getDate())
      || (this.year === date.getFullYear() && this.month === date.getMonth()
        && this.date === date.getDate() && this.hours > date.getHours())
      || (this.year === date.getFullYear() && this.month === date.getMonth()
        && this.date === date.getDate() && this.hours === date.getHours() && this.minutes >= date.getMinutes())
    ) {
      return true;
    }
    return false;
  }

  isToday (date) {
    return (this.date === date.getDate()) && (this.month === date.getMonth()) && (this.year === date.getFullYear());
  }

  next (level, minutes) {
    this.addMinute(level, minutes);
    return this;
  }

  toDate () {
    return new Date(this.year, this.month, this.date, this.hours, this.minutes);
  }

  toTime () {
    return this.toDate().getTime();
  }

  toString () {
    return `${this.year} ${this.month} ${this.date} ${this.hours} ${this.minutes}`;
  }

  addYear (level, years) {
    this.year += years;
    level('years', this);
  }

  addMonth (level, months) {
    this._inc('month', 12, months, this.addYear, level);
    level('months', this);
  }

  addDate (level, days) {
    // Day
    this.day += days;
    let weeks = this.day > 6 ? Math.floor(this.day / 7) : 0;
    this.day %= 7;
    if (weeks) {
      this.week += weeks;
      level('weeks', this);
    }
    // Date
    this.date += days;
    let limit = 0,
      months = 0;
    while ((limit = DateTime.getMonthLength(this.year, this.month)) - 1 < this.date) {
      this.date -= limit;
      months++;
    }
    if (months) {
      this.addMonth(level, months);
    }
    level('date', this);
    level('day', this);
  }

  addHours (level, hours) {
    let name = 'hours';
    this._inc(name, 24, hours, this.addDate, level);
    level(name, this);
  }

  addMinute (level, minutes) {
    let name = 'minutes';
    this._inc(name, 60, minutes, this.addHours, level);
    level('dateTime', this);
    level(name, this);
  }

  _inc(name, limit, value, action = null, level = null) {
    this[name] += value;
    if (this[name] > limit - 1) {
      let count = value === 1 ? 1 : Math.floor(this[name] / limit);
      this[name] %= limit;
      if (action)
        action.call(this, level, count);
    }
  }

}
