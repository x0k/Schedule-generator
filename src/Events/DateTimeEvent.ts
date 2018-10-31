import DateTime from './DateTime';

type THandler = (dateTime: DateTime, values: any) => any;

export interface IHandler {
  name: string;
  require: string[];
  handler: THandler;
}

interface IHandlersMap { [name: string]: THandler; }

export class DateTimeEvent {

  private order: string[] = [];
  private handlers: IHandlersMap = {};

  public add (handler: IHandler) {
    this.order.push(handler.name);
    this.handlers[handler.name] = handler.handler;
  }

  public run (dateTime: DateTime, values: object) {
    for (const handlerName of this.order) {
      const handler = this.handlers[handlerName];
      values[handlerName] = handler(dateTime, values);
    }
  }

}
