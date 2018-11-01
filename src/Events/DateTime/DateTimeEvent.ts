import DateTime from './DateTime';

export type THandler = (dateTime: DateTime, values: any) => any;

interface IHandlersMap { [name: string]: THandler; }

export class DateTimeEvent {

  private order: string[] = [];
  private handlers: IHandlersMap = {};

  public add (name: string, handler: THandler) {
    this.order.push(name);
    this.handlers[name] = handler;
  }

  public run (dateTime: DateTime, values: object) {
    for (const handlerName of this.order) {
      const handler = this.handlers[handlerName];
      values[handlerName] = handler(dateTime, values);
    }
  }

}
