import { buildAction } from 'rule-interpreter';

import { IValues } from './actions';
import { operations } from './operations';

const getter = (array: any[], id: number) => {
  const el = array[id];
  if (el in operations) {
    return operations[el];
  }
  return el;
};

export type THandler = () => any;

export class Interpreter {

  constructor (
    private input: IValues = {},
    private output: any[] = [],
  ) { }

  public toHandler (data: any[]): THandler {
    const action = buildAction(data, getter);
    return () => action(this.input, this.output);
  }

}
