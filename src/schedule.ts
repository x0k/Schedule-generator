import { IConstraint } from './dateTime/dateTime';
import { IRuleData } from './rules/rule';

export interface IScheduleHandler extends IRuleData {
  expression: any[];
}

export interface IScheduleConstraint extends IConstraint {
  expression?: any[];
}

export interface ISchedule {
  name: string;
  extractor: string;
  constraints: { [name: string]: IScheduleConstraint };
  rules: IScheduleHandler[];
}
