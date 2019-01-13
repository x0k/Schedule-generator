import { DateTime } from './dateTime/dateTime';

export class Event {

  public value: any;
  public points: number[];

  constructor (value: any, dateTime: DateTime) {
    this.value = value;
    this.points = [ dateTime.toTime() ];
  }

  public addPoint (dateTime: DateTime) {
    this.points.push(dateTime.toTime());
  }

}