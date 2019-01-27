export class Event {

  public value: any;
  public points: number[];

  constructor (time: number, value: any) {
    this.value = value;
    this.points = [ time ];
  }

  public addPoint (time: number) {
    this.points.push(time);
  }

}
