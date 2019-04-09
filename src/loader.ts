import { Generator } from './generator'
import {
  ISchedule,
  IConstraints,
  IRuleData
} from './core/schedule'

export class Loader {
  private constraints: IConstraints = {};
  private rules: IRuleData[] = [];

  public async load (...schedules: ISchedule[]) {
    for (const schedule of schedules) {
      this.constraints = schedule.constraints
      this.rules = schedule.rules
    }
    return new Generator(this.rules, this.constraints)
  }
}
