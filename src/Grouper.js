import { deepEqual } from 'fast-equals';

export default class Grouper {

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

  static async toList (step, groups, filter = false) {
    if (!groups.length)
      return [];
    let line = [],
      result = [];
    for (let group of groups) {
      line.push(...group.points.map(start => ({ start, value: group.value, length: step })));
    }
    line.sort((a,b) => a.start - b.start);
    let last = line[0];
    for (let i = 1; i < line.length; i++) {
      let current = line[i];
      if (last.start + last.length === current.start && deepEqual(last.value, current.value)) {
        last.length += current.length;
      } else {
        result.push(last);
        last = current;
      }
    }
    result.push(last);
    return filter ? result.filter(el => el.value) : result;
  }

  static getPartionSize (partion) {
    switch (partion) {
    case 'minute':
      return 60000;
    case 'hour':
      return 3600000;
    case 'day':
      return 86400000;
    case 'week':
      return 604800000;
    }
  }

  static getPartionStart (partion, begin) {
    let getDate = () => {
      let date = new Date(begin);
      switch (partion) {
      case 'month':
        date.setDate(0);
        date.setHours(0, 0, 0, 0);
        return date;
      case 'week': {
        let day = date.getDay() === 0 ? 6 : date.getDay() - 1,
          dt = date.getDate();
        date.setDate(dt - day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      case 'day':
        date.setHours(0, 0, 0, 0);
        return date;
      case 'hour':
        date.setMinutes(0, 0, 0);
        return date;
      }
    };
    return getDate().getTime();
  }

  static async groupBy (partion, list) {
    if (!list.length)
      return [];
    let groups = [],
      length = Grouper.getPartionSize(partion);
    let i = 0;
    while (i < list.length) {
      let item = list[i],
        start = Grouper.getPartionStart(partion, item.start),
        group = { start, length, items: [] };
      while (i < list.length && item.start >= group.start && item.start < group.start + group.length) {
        group.items.push(item);
        item = list[++i];
      }
      if (group.items.length) {
        groups.push(group);
      }
    }
    return groups;
  }

  static partionToString (partion, date, locale = 'ru-RU') {
    let loc = options => date.toLocaleString(locale, options);
    switch (partion) {
    case 'month':
      return loc({ month: 'long', year: 'numeric' });
    case 'week':
      return loc({ month: 'short', year: 'numeric', day: 'numeric' });
    case 'day':
      return loc({ month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'long' });
    case 'hour':
      return loc({ month: 'numeric', year: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric' });
    }
  }

  static partionToTimePeriod (start, length) {
    let d1 = new Date(start),
      d2 = new Date(start + length),
      zb = val => val < 10 ? '0'+val : val;
    return `${d1.getHours()}:${zb(d1.getMinutes())} - ${d2.getHours()}:${zb(d2.getMinutes())}`;
  }

}