export default class Event {

  constructor (data) {
    this.name = data.name;
    this.handler = data.handler;
    this.listners = [];
  }

  get name () {
    return this.name;
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
