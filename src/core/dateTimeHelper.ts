import { DateTime } from './dateTime';

export function before (dateTime: DateTime, date: Date) {
  if (dateTime.get('year') < date.getFullYear()) {
    return true;
  }
  if (dateTime.get('year') === date.getFullYear()) {
    if (dateTime.get('month') < date.getMonth()) {
      return true;
    }
    if (dateTime.get('month') === date.getMonth()) {
      if (dateTime.get('date') < date.getDate()) {
        return true;
      }
      if (dateTime.get('date') === date.getDate()) {
        if (dateTime.get('hour') < date.getHours()) {
          return true;
        }
        if ((dateTime.get('hour') === date.getHours()) && dateTime.get('minute') < date.getMinutes()) {
          return true;
        }
      }
    }
  }
  return false;
}

export function after (dateTime: DateTime, date: Date) {
  if (dateTime.get('year') > date.getFullYear()) {
    return true;
  }
  if (dateTime.get('year') === date.getFullYear()) {
    if (dateTime.get('month') > date.getMonth()) {
      return true;
    }
    if (dateTime.get('month') === date.getMonth()) {
      if (dateTime.get('date') > date.getDate()) {
        return true;
      }
      if (dateTime.get('date') === date.getDate()) {
        if (dateTime.get('hour') > date.getHours()) {
          return true;
        }
        if ((dateTime.get('hour') === date.getHours()) && dateTime.get('minute') >= date.getMinutes()) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isToday (dateTime: DateTime, date: Date) {
  return (dateTime.get('date') === date.getDate()) &&
    (dateTime.get('month') === date.getMonth()) && (dateTime.get('year') === date.getFullYear());
}
