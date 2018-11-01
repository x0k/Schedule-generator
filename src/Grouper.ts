import equal from 'deep-equal';

export default class Grouper {

  private static getOffsetSize (offsetSize: string): number {
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

  private offsetSize: number;
  private groups: any[] = [];

  constructor (private now: Date, offsetSize: string) {
    this.offsetSize = Grouper.getOffsetSize(offsetSize);
  }

  public add (value: any): void {
    const last = (this.groups.length > 0) ? this.groups[this.groups.length - 1] : null;
    if (!last || (!(last[1] === value))) {
      if (last) {
        last[0] += this.offsetSize;
      }
      this.groups.push([0, value]);
    } else {
      last[0] += this.offsetSize;
    }
  }

  public print (): void {
    for (const [offset, value] of this.groups) {
      if (value) {
        console.log(`${this.dateToString(this.now)}: ${value}`);
      }
      this.now.setTime(this.now.getTime() + offset);
    }
  }

  private dayToName (day: number) {
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

  private dateToString (date: Date): string {
    return `${date.getDate()}.${date.getMonth() +1} ${this.dayToName(date.getDay())} ${date.getHours()}:${date.getMinutes()}`;
  }

}
