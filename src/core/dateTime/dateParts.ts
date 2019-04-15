import { getMonthLength } from './dateHelper'

interface Dictionary {
  [key: string]: number
}

export interface Years extends Dictionary {
  year: number
}
export interface Months extends Years {
  month: number
}
export interface Days extends Months {
  day: number
}
export interface Hours extends Days {
  hour: number
}
export interface Minutes extends Hours {
  minute: number
}

export const isNumber = <T>(data: number | T): data is number => typeof data === 'number'

export function * years (value: number) {
  while (true) {
    yield { year: value++ }
  }
}
export function * months (value: number, { year }: Years) {
  while (value < 12) {
    yield { month: value++, year }
  }
  return value % 12
}
export function * days (value: number, data: Months | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year, month } = data
  const len = getMonthLength(year, month)
  while (value < len) {
    yield { day: value++, month, year }
  }
  return value % len
}
export function * hours (value: number, data: Days | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  while (value < 24) {
    yield { hour: value++, ...data }
  }
  return value % 24
}
export function * minutes (value: number, data: Hours | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  while (value < 60) {
    yield { minute: value++, ...data }
  }
  return value % 60
}
