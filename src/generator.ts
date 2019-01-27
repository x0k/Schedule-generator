import { deepEqual } from 'fast-equals';
import { DateTime, IConstraints } from './core/dateTime';
import { IRuleData, Rule } from './core/rule';
import { Interpreter } from './core/interpreter';
import { createEvents } from './grouper';

type RuleTree = Map<string, IRuleTree>;
interface IRuleTree extends Map<string, RuleTree> { }

const getPaths = (identifiers: Set<string>, tree: IRuleTree) => {
  const result = new Map();
  for (const [id, value] of tree) {
    const childrens = value.size ? getPaths(identifiers, value) : new Map();
    if (identifiers.has(id) || childrens.size) {
      result.set(id, childrens);
    }
  }
  return result;
};

const initialRules: Rule[] = [
  { id: 'dateTime', handler: (data: any, dt: DateTime) => dt, require: new Set() },
  { id: 'year', handler: (data: any, dt: DateTime) => dt.get('year'), require: new Set() },
  { id: 'month', handler: (data: any, dt: DateTime) => dt.get('month'), require: new Set() },
  { id: 'date', handler: (data: any, dt: DateTime) => dt.get('date'), require: new Set() },
  { id: 'week', handler: (data: any, dt: DateTime) => dt.get('week'), require: new Set() },
  { id: 'day', handler: (data: any, dt: DateTime) => dt.get('day'), require: new Set() },
  { id: 'hour', handler: (data: any, dt: DateTime) => dt.get('hour'), require: new Set() },
  { id: 'minute', handler: (data: any, dt: DateTime) => dt.get('minute'), require: new Set() },
];

export class Generator {

  public out: any[] = [];
  private rules: { [id: string]: Rule } = {};
  private values: { [id: string]: any } = {};
  private constraints: IConstraints;
  private tree: IRuleTree = new Map();
  private interpreter = new Interpreter(this.values, this.out);

  constructor (rules: IRuleData[], constraints: IConstraints) {
    for (const rule of initialRules) {
      this.rules[rule.id] = rule;
      this.tree.set(rule.id, new Map());
    }
    for (const rule of rules) {
      this.addRule(rule);
    }
    this.constraints = constraints;
  }

  public hasRule (id: string) {
    return id in this.rules;
  }

  public getRule (id: string) {
    return this.rules[id];
  }

  public addRule (data: IRuleData) {
    const rule = new Rule(data, this.interpreter);
    if (this.hasRule(rule.id)) {
      throw new Error(`Rule ${rule.id} are exist`);
    }
    let paths = rule.require.size ? getPaths(rule.require, this.tree) : new Map();
    let parent = this.tree;
    let init = true;
    while ((paths.size === 1 || paths.size > 1) && init) {
      init = false;
      const last = Array.from(paths.keys()).pop();
      paths = paths.get(last);
      const p = parent.get(last);
      if (!p) {
        throw new Error(`Parent ${last} doesn't exist`);
      }
      parent = p;
    }
    parent.set(rule.id, new Map());
    this.rules[rule.id] = rule;
    return rule;
  }

  public getRuleListners (id: string) {
    const find = (tree: IRuleTree): IRuleTree | false => {
      if (tree.has(id)) {
        const ls = tree.get(id);
        if (!ls) {
          throw new Error(`Listner of ${id} are undefined`);
        }
        return ls;
      }
      for (const value of tree.values()) {
        if (value.size > 0) {
          const result = find(value);
          if (result) {
            return result;
          }
        }
      }
      return false;
    };
    return find(this.tree);
  }

  public emit = (ruleId: string, ...args: any[]) => {
    const raise = (id: string, listners: IRuleTree | false) => {
      const rule = this.getRule(id);
      const value = rule.handler(this.values, ...args);
      if (!deepEqual(this.values[id], value)) {
        this.values[id] = value;
        if (listners && listners.size) {
          for (const [listnerId, listnerValue] of listners) {
            raise(listnerId, listnerValue);
          }
        }
      }
    };
    raise(ruleId, this.getRuleListners(ruleId));
  }

  public async run (begin: Date, end: Date) {
    const dateTime = new DateTime(begin, end, this.constraints);
    for (const rule of initialRules) {
      this.emit(rule.id, dateTime);
    }
    while (dateTime.done) {
      dateTime.next(this.emit, 'minute');
    }
    return await createEvents(this.out);
  }

}
