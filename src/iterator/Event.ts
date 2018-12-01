export default class Event {

  public handler: any;
  public listners: string[];

  constructor (handler: any) {
    this.handler = handler;
    this.listners = [];
  }

  public addListner (name: string): void {
    this.listners.push(name);
  }

}
