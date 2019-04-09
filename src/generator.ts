import { deepEqual } from 'fast-equals'
import dateTime, { IDateTime } from './core/dateTime'
import { Rule } from './core/rule'
import { ISchedule, IConstraints, IRuleData } from './core/schedule'
import { Interpreter } from './core/interpreter'

type RuleTree = Map<string, IRuleTree>;
interface IRuleTree extends Map<string, RuleTree> { }

const getPaths = (identifiers: Set<string>, tree: IRuleTree) => {
  const result = new Map()
  for (const [id, value] of tree) {
    const childrens = value.size ? getPaths(identifiers, value) : new Map()
    if (identifiers.has(id) || childrens.size) {
      result.set(id, childrens)
    }
  }
  return result
}

export class Generator {
  public out: any[] = [];
  private rules: { [id: string]: Rule } = {};
  private values: { [id: string]: any } = {};
  private constraints: IConstraints;
  private tree: IRuleTree = new Map();
  private interpreter = new Interpreter(this.values, this.out);
  private initialRules: Rule[] = [
    { id: 'dateTime', handler: () => this.values.dateTime, require: new Set() },
    { id: 'year', handler: () => this.values.dateTime.get('year'), require: new Set() },
    { id: 'month', handler: () => this.values.dateTime.get('month'), require: new Set() },
    { id: 'date', handler: () => this.values.dateTime.get('date'), require: new Set() },
    { id: 'week', handler: () => this.values.dateTime.get('week'), require: new Set() },
    { id: 'day', handler: () => this.values.dateTime.get('day'), require: new Set() },
    { id: 'hour', handler: () => this.values.dateTime.get('hour'), require: new Set() },
    { id: 'minute', handler: () => this.values.dateTime.get('minute'), require: new Set() }
  ];

  public constructor (schedule: ISchedule) {
    for (const rule of this.initialRules) {
      this.rules[rule.id] = rule
      this.tree.set(rule.id, new Map())
    }
    for (const rule of schedule.rules) {
      this.addRule(rule)
    }
    this.constraints = schedule.constraints
  }

  public hasRule (id: string) {
    return id in this.rules
  }

  public getRule (id: string) {
    return this.rules[id]
  }

  public addRule (data: IRuleData) {
    const rule = new Rule(data, this.interpreter)
    if (this.hasRule(rule.id)) {
      throw new Error(`Rule ${rule.id} are exist`)
    }
    let paths = rule.require.size ? getPaths(rule.require, this.tree) : new Map()
    let parent = this.tree
    let init = true
    while ((paths.size === 1 || paths.size > 1) && init) {
      init = false
      const last = Array.from(paths.keys()).pop()
      paths = paths.get(last)
      const p = parent.get(last)
      if (!p) {
        throw new Error(`Parent ${last} doesn't exist`)
      }
      parent = p
    }
    parent.set(rule.id, new Map())
    this.rules[rule.id] = rule
    return rule
  }

  public getRuleListeners (id: string) {
    const find = (tree: IRuleTree): IRuleTree | false => {
      if (tree.has(id)) {
        const ls = tree.get(id)
        if (!ls) {
          throw new Error(`Listener of ${id} are undefined`)
        }
        return ls
      }
      for (const value of tree.values()) {
        if (value.size > 0) {
          const result = find(value)
          if (result) {
            return result
          }
        }
      }
      return false
    }
    return find(this.tree)
  }

  public emit = (ruleId: string) => {
    const raise = (id: string, listeners: IRuleTree | false) => {
      const rule = this.getRule(id)
      const value = rule.handler()
      if (!deepEqual(this.values[id], value)) {
        this.values[id] = value
        if (listeners && listeners.size) {
          for (const [listenerId, listenerListeners] of listeners) {
            raise(listenerId, listenerListeners)
          }
        }
      }
    }
    raise(ruleId, this.getRuleListeners(ruleId))
  }

  public async run (begin: Date, end: Date) {
    const condition = ({ year, month, day, hour, minute }: IDateTime) => year < end.getFullYear() ||
      month < end.getMonth() ||
      day < end.getDate() ||
      hour < end.getHours() ||
      minute <= end.getMinutes()
    for (const event of dateTime(begin, condition, 10)) {
      this.emit()
    }
    return this.out
  }
}
