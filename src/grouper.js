export default class Grouper {

  static getOffsetSize (offsetSize) {
    switch (offsetSize) {
    case 'minutes':
      return 60000;
    case 'hours':
      return 3600000;
    case 'days':
      return 86400000;
    case 'weeks':
      return 604800000;
    }
  }

  constructor (now, offsetSize) {
    this.now = now;
    this.groups = [];
    this.offsetSize = Grouper.getOffsetSize(offsetSize);
    this.initialOffset = now.getTime();
  }

  add (val) {
    if (val.subjects) {
      console.log(val.subjects);
    }
    const len = this.groups.length,
      last = (len > 0) ? this.groups[len - 1] : null,
      value = val.subjects;
    if (!last) {
      this.groups.push({
        length: 0,
        start: this.initialOffset,
        value,
      });
    } else if (!(last.value === value)) {
      this.groups.push({
        length: this.offsetSize,
        start: last.start + last.length,
        value,
      });
    } else {
      last.length += this.offsetSize;
    }
  }

  print () {
    for (const group of this.groups) {
      if (group.value) {
        console.log(`${this.dateToString(group.start, group.length)} - ${group.value}`);
      }
    }
  }

  dayToName (day) {
    switch (day) {
    case 0:
      return 'Вс';
    case 1:
      return 'Пн';
    case 2:
      return 'Вт';
    case 3:
      return 'Ср';
    case 4:
      return 'Чт';
    case 5:
      return 'Пт';
    case 6:
      return 'Сб';
    }
  }

  dateToString (start, length) {
    const sDate = new Date(start),
      eDate = new Date(start + length);
    return `${sDate.getDate()}.${sDate.getMonth() + 1} ${this.dayToName(sDate.getDay())} ` +
      `${sDate.getHours()}:${sDate.getMinutes()} - ${eDate.getHours()}:${eDate.getMinutes()}`;
  }

}