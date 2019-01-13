import { deepEqual } from 'fast-equals';
import { Event } from './event';
import { IConstraints } from './dateTime/dateTime';

export interface ILineEvent {
  start: number;
  value: any;
  length: number;
}

export interface IEventGroup {
  start: number;
  items: ILineEvent[];
  length: number;
}

export interface IPartionOptions {
  month?: string;
  year?: string;
  day?: string;
  weekday?: string;
  hour?: string;
}

export interface IToListArgs {
  events: Event[];
  filter?: boolean;
  constraints?: IConstraints;
  from?: Date;
  to?: Date;
}

export class Grouper {

  public static getTimeBethwen (begin: Date, end: Date) {
    return end.getTime() - begin.getTime();
  }

  public static toSeconds (milliseconds: number) {
    return milliseconds / 1000;
  }

  public static toMinutes (milliseconds: number) {
    return milliseconds / 60000;
  }

  public static toHours (milliseconds: number) {
    return milliseconds / 3600000;
  }

  public static toDays (milliseconds: number) {
    return milliseconds / 86400000;
  }

  public static toWeeks (milliseconds: number) {
    return milliseconds / 604800000;
  }

  public static dayToName (day: number) {
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

  public static getPartionSize (partion: string) {
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

  public static getPartionStart (partion: string, begin: number) {
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

  public static async groupBy (partion: string, list: ILineEvent[]): Promise<IEventGroup[]> {
    if (!list.length) {
      return [];
    }
    const groups: IEventGroup[] = [];
    const length = Grouper.getPartionSize(partion);
    let i = 0;
    while (i < list.length) {
      let item = list[i];
      const start = Grouper.getPartionStart(partion, item.start);
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

  public static partionToString (partion: string, date: Date, locale = "ru-RU") {
    const loc = (options: IPartionOptions) => date.toLocaleString(locale, options);
    switch (partion) {
    case "month":
      return loc({ month: "long", year: "numeric" });
    case "week":
      return loc({ month: "short", year: "numeric", day: "numeric" });
    case "day":
      return loc({ month: "numeric", year: "numeric", day: "numeric", weekday: "long" });
    case "hour":
      return loc({ month: "numeric", year: "numeric", day: "numeric", weekday: "short", hour: "numeric" });
    }
  }

  public static partionToTimePeriod (start: number, length: number) {
    const d1 = new Date(start);
    const d2 = new Date(start + length);
    const zb = (val: number) => val < 10 ? "0" + val : val;
    return `${d1.getHours()}:${zb(d1.getMinutes())} - ${d2.getHours()}:${zb(d2.getMinutes())}`;
  }

  public static async toList ({ events, filter = true, constraints, from, to }: IToListArgs): Promise<ILineEvent[]> {
    if (events.length === 0) {
      return [];
    }

    const line: ILineEvent[] = [];
    const stepFromConstraints = constraints && Grouper.calcStepFromConstraints(constraints);
    const step = stepFromConstraints || Grouper.calcStepFromEvents(events);
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

  private static calcStepFromConstraints (constraints: IConstraints) {
    const partions = ['minute', 'hour', 'day', 'week'];
    for (const partion of partions) {
      const step = constraints[partion].step;
      if (step) {
        return Grouper.getPartionSize(partion) * step;
      }
    }
    return false;
  }

  private static calcStepFromEvents (events: Event[]) {
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

}
