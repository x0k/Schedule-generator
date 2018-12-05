import DateTime from './iterator/DateTime';
import DateTimeEvent from './iterator/DateTimeEvent';
import DateTimeIterator from './iterator/DateTimeIterator';

const operations = {
  'before': (date: DateTime, value: Date) => date.before(value),
  'after': (date: DateTime, value: Date) => date.after(value),
  'inPeriod': (date: DateTime, dateBegin: Date, dateEnd: Date) => {
    return operations.after(date, dateBegin) && operations.before(date, dateEnd);
  },
  'time': (date: DateTime, h: number, m: number): Date => {
    const timeDate = date.toDate();
    timeDate.setHours(h, m);
    return timeDate;
  },
  '+': (a: any, b: any) => a + b,
  '-': (a: any, b: any) => a - b,
  '/': (a: any, b: any) => a / b,
  '*': (a: any, b: any) => a * b,
};

export default class Generator {

  private iterator;

  constructor () {
    this.iterator = new DateTimeIterator();
  }

  public load (data) {
    for (const event of data) {

    }
  }

  public run (begin: Date, end: Date, event: string): any[] {
    const data = [];
    this.iterator.addListner('solver', {
      require: ['subjects'],
      handler: (v) => data.push(v),
    });
    this.iterator.start(begin, end);
    return data;
  }

  private toHandler (parameters: any, queue: any[]) {
    const stack = [];

    return (...data) => {

    };
  }

}
