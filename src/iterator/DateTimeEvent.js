import Event from './Event';

export default class DateTimeEvent extends Event {

  constructor (handler, level) {
    super(handler);
    this.level = level;
  }

}
