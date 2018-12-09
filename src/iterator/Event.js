export default class Event {

  constructor (data) {
    this.name = data.name;
    this.handler = data.handler;
    if (data.value) {
      this.value = data.value;
    } else {
      this.value = () => true;
    }
    this.listners = [];
  }

  get name () {
    return this.name;
  }

  getValue (data) {
    return this.value(data);
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
