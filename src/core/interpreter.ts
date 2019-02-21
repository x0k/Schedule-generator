import { buildActions } from 'rule-interpreter';

import { IValues } from './actions';
import { operations } from './operations';

const getter = (el: any) => {
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
    const [ action ] = buildActions(data, getter);
    return () => action(this.input, this.output);
  }

}
