import { IConstraints } from './dateTime';
import { IRuleData } from './rule';

export interface ISchedule {
  name: string;
  from: number;
  to: number;
  constraints: IConstraints;
  rules: IRuleData[];
}
