export default class Event {

  constructor (handler) {
    this.handler = handler;
    this.listners = [];
  }

  addListner (name) {
    this.listners.push(name);
  }

  delListner (name) {
    const index = this.listners.indexOf(name);
    if (index >= 0) {
      this.listners.splice(index, 1);
    }
  }

}
