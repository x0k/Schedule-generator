import DateTime from './DateTime';

interface IEvent {
  name: string;
  handler: (dateTime: DateTime, values: object) => any;
}

export default class EventProvider {

  private values: object = {};
  private handlers: object = {};

  constructor (private begin: Date, private end: Date, handlers: object) {
    for (const name in handlers) {
      if (handlers.hasOwnProperty(name)) {
        for (const event of handlers[name]) {
          this.addEvent(name, event);
        }
      }
    }
  }

  public start () {
    const self = this,
      val = new DateTime(this.begin);
    for (const name in this.handlers) {
      if (this.handlers.hasOwnProperty(name)) {
        this.emit(name, val);
      }
    }
    while (val.before(this.end)) {
      val.next(this.emit);
    }
  }

  public addEvent (on: string, event: IEvent) {
    const hdl = (dateTime: DateTime, values: object) => {
      const val = event.handler(dateTime, values);
      if (values[event.name] === null && val !== null) {
        this.emit(name, dateTime);
      }
      values[event.name] = val;
    };
    if (this.handlers[on]) {
      this.handlers[on].push(hdl);
    } else {
      this.handlers[on] = new Array(hdl);
    }
  }

  private emit (name, dateTime: DateTime) {
    for (const handler of this.handlers[name]) {
      handler(dateTime);
    }
  }

}
