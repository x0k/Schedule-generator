import Event from './Event';

export interface IDateTimeEvent {
  handler: any;
  require: string[];
}

export class DateTimeEvent extends Event {
  public level: number;

  constructor (handler: any, level: number) {
    super(handler);
    this.level = level;
  }

}
