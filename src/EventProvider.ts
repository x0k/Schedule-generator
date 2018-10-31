import DateTime from './DateTime';

type THandler = (dateTime: DateTime, values: object) => any;

type THandlersMap = { [name: string]: THandler };

interface IHandler {
  name: string;
  require: Array<string>;
  handler: THandler;
}

interface IEvent {
  order: Array<string>;
  handlers: THandlersMap;
}

const EmptyEvent = (): IEvent => ({
  order: [],
  handlers: {}
});

export default class EventProvider {

  private values: { [name: string]: any } = {};
  private events: { [name: string]: IEvent } = {
    minutes: EmptyEvent(),
    hours: EmptyEvent(),
    days: EmptyEvent(),
    months: EmptyEvent(),
    years: EmptyEvent()
  };

  public start (begin: Date, end: Date) {
    const val = new DateTime(begin),
      onChange = this.emit.bind(this);
    for (const name in this.events) {
      if (this.events.hasOwnProperty(name)) {
        this.emit(name, val);
      }
    }
    while (val.before(end)) {
      val.next(onChange);
    }
  }

  public on (name: string, handler: IHandler) {
    if (name in this.events) {
      const event = this.events[name];
      event.order.push(handler.name);
      event.handlers[handler.name] = handler.handler;
    } else {
      this.events[name] = {
        order: [ handler.name ],
        handlers: {
          [handler.name]: handler.handler 
        }
      };
    }
  }

  private emit (name, dateTime: DateTime) {
    const event = this.events[name];
    for (const handlerName of event.order) {
      const handler = event.handlers[handlerName];
      this.values[handlerName] = handler(dateTime, this.values);
    }
  }

}
