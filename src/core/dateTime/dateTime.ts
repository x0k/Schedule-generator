import { TOnChangeEvent, datePart } from './datePart';
import { getMonthLength } from './dateHelper';
import { Interpreter, THandler } from '../interpreter';

export interface IConstraint {
  step?: number;
  expression?: any[];
}

export interface IConstraints {
  [name: string]: IConstraint;
}

export function dateTime (from: Date, end: Date, constraints: IConstraints) {
  const minutes = 
}
