import { DateTime } from './dateTime';

export class Event {

  public value: any;
  public points: number[];

  constructor (dateTime: DateTime, value: any) {
    this.value = value;
    this.points = [ dateTime.toTime() ];
  }

  public addPoint (dateTime: DateTime) {
    this.points.push(dateTime.toTime());
  }

}
