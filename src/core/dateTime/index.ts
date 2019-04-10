import { decorate, wrap } from 'iterator-wrapper'

import { getMonthLength } from './dateHelper'

export interface Steps {
  minute: number
  hour: number
  day: number
  month: number
  year: number
}

export * from './dateHelper'

interface Dictionary {
  [key: string]: number
}

const iterable = <T extends D, D extends Dictionary>(key: string, lim: number, step: number = 1) => function * (initialValue: T, date: D) {
  let value = initialValue[key]
  while (value < lim) {
    yield { ...initialValue, [key]: value, ...date }
    value += step
  }
  return { ...initialValue, [key]: value % lim, ...date }
}

interface Years extends Dictionary {
  year: number
}
interface Months extends Years {
  month: number
}

interface Days extends Months {
  day: number
}

interface Hours extends Days {
  hour: number
}

export interface Minutes extends Hours {
  minute: number
}

function toMinutes (date: Date): Minutes {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export default (begin: Date, end: Date, steps: Minutes) => {
  const condition = ({ year, month, day, hour, minute }: Minutes) => year < end.getFullYear() ||
    month < end.getMonth() ||
    day < end.getDate() ||
    hour < end.getHours() ||
    minute <= end.getMinutes()
  function * years ({ year }: Years) {
    while (true) {
      let data: Years = { year: year++ }
      yield data
    }
  }
  const months = iterable<Months, Years>('month', 12, steps.month)
  function * days (initialValue: Days, date: Months) {
    const { year, month } = date
    const len = getMonthLength(year, month)
    let value = initialValue.day
    while (value < len) {
      let data: Days = { day: value, ...date }
      yield data
      value += steps.day
    }
    let result: Days = { day: value % len, ...date }
    return result
  }
  const hours = iterable<Hours, Days>('hour', 24, steps.hour)
  const minutes = iterable<Minutes, Hours>('minute', 60, steps.minute)
  const from = toMinutes(begin)

  const period = wrap<Minutes>(
    decorate<Hours, Minutes>(
      decorate<Days, Hours>(
        decorate<Months, Days>(
          decorate<Years, Months>(
            years,
            months
          ),
          days
        ),
        hours
      ),
      minutes
    ),
    condition
  )
  return period(from)
}
