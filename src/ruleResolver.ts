import { deepEqual } from 'fast-equals';
import { DateTime } from './core/dateTime';
import { IRuleData, Rule } from './core/rule';
import { Interpreter } from './core/interpreter';
import { Event } from './core/event';

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

export class RuleResolver {

  public out: any[] = [];
  protected rules: { [id: string]: Rule } = {};
  protected values: { [id: string]: any } = {};
  private dateTime: DateTime;
  private tree: IRuleTree = new Map();
  private interpreter = new Interpreter(this.values, this.out);

  constructor (dateTime: DateTime, rules: Rule[]) {
    this.dateTime = dateTime;
    for (const rule of rules) {
      this.rules[rule.id] = rule;
      this.tree.set(rule.id, new Map());
    }
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

  public async run () {
    while (this.dateTime.done) {
      this.dateTime.next(this.emit, 'minute');
    }
    const result = [];
    let last: Event | null = null;
    for (const [date, ...data] of this.out) {
      const value = data.length === 1 ? data[0] : data;
      if (last && deepEqual(last.value, value)) {
        last.addPoint(date);
      } else {
        last = new Event(date, value);
        result.push(last);
      }
    }
    return result;
  }

}
