class DatePart {

  constructor (value, step = 1, hanlder = (value => value), limit = (() => Number.MAX_VALUE), limitNames = []) {
    this._value = value;
    this._step = step;
    this._handler = hanlder;
    this._limit = limit;
    this._limitNames = limitNames;
  }

  next (value = null) {
    this._value += value ? (value % this._step ? Math.ceil(value / this._step) * this._step : value) : this._step;
    let limit = this._limit();
    if (this.value < limit)
      return 0;
    let count = Math.floor(this._value / limit);
    this._value %= limit;
    return count;
  }

  get value () {
    return this._value;
  }

  get done () {
    return this._handler(this._value);
  }

  get limitNames () {
    return this._limitNames;
  }

}

export default class DateTime {

  static leapYear (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  static getMonthLength (year, month) {
    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
  }

  constructor (from, constraints = null) {
    let dateParts = [
      { name: 'year', get: date => date.getFullYear() },
      { name: 'month', get: date => date.getMonth(), limit: () => 12, limitNames: ['year'] },
      { name: 'date', get: date => date.getDate(), limit: () => DateTime.getMonthLength(this.year._value, this.month._value), limitNames: ['month'] },
      { name: 'week', get: date => {
        var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
      } },
      { name: 'day', get: date => date.getDay(), limit: () => 7, limitNames: ['week'] },
      { name: 'hour', get: date => date.getHours(), limit: () => 24, limitNames: ['day', 'date'] },
      { name: 'minute', get: date => date.getMinutes(), limit: () => 60, limitNames: ['hour'] },
    ];
    for (let { name, get, limit, limitNames } of dateParts) {
      let step, hanlder;
      if (constraints && constraints[name]) {
        let con = constraints[name];
        if (con.step) {
          step = con.step;
        }
        if (con.hanlder) {
          hanlder = con.hanlder;
        }
      }
      let alias = `_${name}`;
      this[alias] = new DatePart(get(from), step, hanlder, limit, limitNames);
      Object.defineProperty(this, name, { get: () => this[alias].value });
    }
  }

  next (level, name, value = null) {
    let part = this[`_${name}`],
      count = part.next(value),
      flag = true;
    if (count) {
      for (let limit of part.limitNames) {
        let value = this.next(level, limit, count);
        flag = flag && (value || value === 0);
      }
      if (flag) {
        level(name, this);
      }
    }
    return flag && part.done;
  }

  toDate () {
    return new Date(this.year, this.month, this.date, this.hour, this.minute);
  }

  toTime () {
    return this.toDate().getTime();
  }

  toString () {
    return `${this.year} ${this.month} ${this.date} ${this.hour} ${this.minute}`;
  }

}
