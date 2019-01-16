import { deepEqual } from 'fast-equals';
import { Event } from './event';
import { IConstraints } from './dateTime/dateTime';

export interface IPeriod {
  start: number;
  length: number;
}

export interface ILineEvent extends IPeriod {
  value: any;
}

export interface IEventGroup extends IPeriod {
  items: ILineEvent[];
}

type NumericPartionOption = 'numeric' | '2-digit';
type StringPartionOption = 'narrow' | 'short' | 'long';

export interface IPartionOptions {
  month?: NumericPartionOption | StringPartionOption;
  year?: NumericPartionOption;
  day?: NumericPartionOption;
  weekday?: StringPartionOption;
  hour?: NumericPartionOption;
  minute?: NumericPartionOption;
}

export interface IToListArgs {
  events: Event[];
  filter?: boolean;
  constraints?: IConstraints;
  from?: Date;
  to?: Date;
}

type Partion = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';

export function getTimeBethwen (begin: Date, end: Date) {
  return end.getTime() - begin.getTime();
}

export function toSeconds (milliseconds: number) {
  return milliseconds / 1000;
}

export function toMinutes (milliseconds: number) {
  return milliseconds / 60000;
}

export function toHours (milliseconds: number) {
  return milliseconds / 3600000;
}

export function toDays (milliseconds: number) {
  return milliseconds / 86400000;
}

export function toWeeks (milliseconds: number) {
  return milliseconds / 604800000;
}

export function dayToName (day: number) {
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
  default:
    throw new Error(`Day ${day} doesn't exist`);
  }
}

export function getPartionSize (partion: Partion) {
  switch (partion) {
  case "minute":
    return 60000;
  case "hour":
    return 3600000;
  case "day":
    return 86400000;
  case 'week': // week
    return 604800000;
  default:
    throw new Error(`Unknown size of partion: ${partion}`);
  }
}

export function getPartionStart (partion: Partion, begin: number) {
  const getDate = () => {
    const date = new Date(begin);
    switch (partion) {
    case "month":
      date.setDate(0);
      date.setHours(0, 0, 0, 0);
      return date;
    case "week": {
      const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const dt = date.getDate();
      date.setDate(dt - day);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    case "day":
      date.setHours(0, 0, 0, 0);
      return date;
    case 'hour':
      date.setMinutes(0, 0, 0);
      return date;
    default:
      throw new Error(`Unknown start for partion: ${partion}`);
    }
  };
  return getDate().getTime();
}

export async function groupBy (partion: Partion, list: ILineEvent[]): Promise<IEventGroup[]> {
  if (!list.length) {
    return [];
  }
  const groups: IEventGroup[] = [];
  const length = getPartionSize(partion);
  let i = 0;
  while (i < list.length) {
    let item = list[i];
    const start = getPartionStart(partion, item.start);
    const group: IEventGroup = { start, length, items: [] };
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

type PartionType = 'item' | 'header';

export function headerPartionToString (partion: Partion, date: Date, locale = "ru-RU") {
  const loc = (options: IPartionOptions) => date.toLocaleString(locale, options);
  switch (partion) {
  case "year":
    return loc({ year: "numeric" });
  case "month":
    return loc({ month: "long", year: "numeric" });
  case "week":
    return loc({ month: "short", year: "numeric", day: "numeric" });
  case "day":
    return loc({ month: "numeric", year: "numeric", day: "numeric", weekday: "long" });
  case "hour":
    return loc({ month: "numeric", year: "numeric", day: "numeric", weekday: "short", hour: "numeric" });
  default:
    throw new Error(`Unexpected partion name: ${partion}`);
  }
}

export function itemPartionToString (partion: Partion, date: Date, locale = "ru-RU") {
  const loc = (options: IPartionOptions) => date.toLocaleString(locale, options);
  switch (partion) {
  case "year":
    return loc({ month: "numeric", day: "numeric", weekday: "short", hour: "numeric", minute: "numeric" });
  case "month":
  case "week":
    return loc({ day: "numeric", weekday: "long", hour: "numeric", minute: "numeric" });
  case "day":
    return loc({ hour: "numeric", minute: "numeric" });
  case "hour":
    return loc({ minute: "numeric" });
  default:
    throw new Error(`Unexpected partion name: ${partion}`);
  }
}

export function toZeroBased (val: number) {
  return String(val < 10 ? "0" + val : val);
}

export function partionToString (partion: Partion, date: Date, type: PartionType = 'item', locale?: string) {
  const pts = type === 'item' ? itemPartionToString : headerPartionToString;
  return pts(partion, date, locale);
}

export function periodToString (partion: Partion, period: IPeriod, type: PartionType = 'item', locale?: string) {
  const pts = (date: Date) => partionToString(partion, date, type, locale);
  const from = new Date(period.start);
  const fromString = pts(from);
  if (period.length === 0) {
    return fromString;
  }
  const to = new Date(period.start + period.length);
  const toString = pts(to);
  let i = 0;
  const splitter = /, |[:-]| /;
  const fromPartions = fromString.split(splitter);
  const toPartions = toString.split(splitter);
  while (i < fromPartions.length && fromPartions[i] === toPartions[i]) {
    i++;
  }
  if (i === fromString.length) {
    return fromString;
  }
  const toStringBegin = toString.indexOf(toPartions[i]);
  return `${fromString} - ${toString.slice(toStringBegin)}`;
}

export async function toList ({ events, filter = true, constraints, from, to }: IToListArgs): Promise<ILineEvent[]> {
  if (events.length === 0) {
    return [];
  }

  const line: ILineEvent[] = [];
  const stepFromConstraints = constraints && calcStepFromConstraints(constraints);
  const step = stepFromConstraints || calcStepFromEvents(events);
  let result: ILineEvent[] = [];

  for (const event of events) {
    line.push(...event.points.map((start) => ({
      start,
      value: event.value,
      length: step,
    })));
  }
  line.sort((a, b) => a.start - b.start);
  let last = line[0];
  for (let i = 1; i < line.length; i++) {
    const current = line[i];
    if (last.start + last.length === current.start && deepEqual(last.value, current.value)) {
      last.length += current.length;
    } else {
      result.push(last);
      last = current;
    }
  }
  result.push(last);
  if (from) {
    const time = from.getTime();
    result = result.filter((el) => el.start >= time);
  }
  if (to) {
    const time = to.getTime();
    result = result.filter((el) => el.start <= time);
  }
  if (filter) {
    result = result.filter((el) => Boolean(el.value));
  }
  return result;
}

export function calcStepFromConstraints (constraints: IConstraints) {
  const partions: Partion[] = ['minute', 'hour', 'day', 'week'];
  for (const partion of partions) {
    const step = constraints[partion].step;
    if (step) {
      return getPartionSize(partion) * step;
    }
  }
  return false;
}

export function calcStepFromEvents (events: Event[]) {
  const sortFn = (a: number, b: number) => b - a;
  const getMinDiff = (points: number[]) => {
    if (points.length < 2) {
      throw new Error(`No points to calc diff`);
    }
    points.sort(sortFn);
    let minDiff = points[0] - points[1];
    if (points.length === 2) {
      return minDiff;
    }
    for (let i = 2; i < points.length; i++) {
      minDiff = Math.min(minDiff, points[i - 1] - points[i]);
    }
    return minDiff;
  };
  let diff = Number.MAX_VALUE;
  for (const event of events) {
    if (event.points.length > 1) {
      diff = Math.min(diff, getMinDiff(event.points));
    }
  }
  return diff;
}
