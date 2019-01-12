export default class Rule {

  constructor (data) {
    this.id = data.id;
    this.handler = data.handler;
    this.require = new Set(data.require);
  }

}
