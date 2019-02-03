import { Operation } from 'rule-interpreter';

import { TAction, IValues, actions } from './actions';

class DateOperation extends Operation<any> {

  protected evaluator (action: TAction, ...values: any[]) {
    return (input: IValues, output: any[]) => {
      return super.evaluator(action(input, output), ...values.map((val) => val(input, output)));
    };
  }

}

export interface IOprations {
  [name: string]: DateOperation;
}

const operations: IOprations = {};

for (const key of Object.keys(actions)) {
  const { action, arity } = actions[key];
  operations[key] = new DateOperation(key, action, arity);
}

export { operations };
