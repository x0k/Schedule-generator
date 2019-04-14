import { wrap, restrict, wrapper } from 'iterator-wrapper'

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

const isMonths = (date: number | Months): date is Months =>
  typeof date === 'object' &&
  typeof date.month === 'number' &&
  typeof date.year === 'number'

const isMinutes = (date: number | Minutes): date is Minutes =>
  typeof date === 'object' &&
  typeof date.minute === 'number' &&
  typeof date.hour === 'number' &&
  typeof date.day === 'number' &&
  typeof date.month === 'number' &&
  typeof date.year === 'number'

export default (begin: Date, end: Date, steps: Minutes) => {
  const condition = (date: Minutes | number) => isMinutes(date) && (
    date.year < end.getFullYear() ||
    date.month < end.getMonth() ||
    date.day < end.getDate() ||
    date.hour < end.getHours() ||
    date.minute <= end.getMinutes()
  )
  function * years (value: number) {
    while (true) {
      yield { year: value++ }
    }
  }
  function * months (value: number, { year }: Years) {
    while (value < 12) {
      yield { month: value++, year }
    }
    return value % 12
  }
  const days: wrapper<Months | number, number, Days> = function * (value, data) {
    if (!isMonths(data)) {
      throw new Error('Type error')
    }
    const { year, month } = data
    const len = getMonthLength(year, month)
    while (value < len) {
      yield { day: value++, month, year }
    }
    return value % len
  }
  const hours: wrapper<Days | number, number, Hours> = function * (value, data) {
    if (typeof data !== 'object') {
      throw new Error('Type error')
    }
    while (value < 24) {
      yield { hour: value++, ...data }
    }
    return value % 24
  }
  const minutes: wrapper<Hours | number, number, Minutes> = function * (value, data) {
    if (typeof data !== 'object') {
      throw new Error('Type error')
    }
    while (value < 60) {
      yield { minute: value++, ...data }
    }
    return value % 60
  }
  const from = toMinutes(begin)

  return restrict<Minutes | number>(
    wrap<Hours | number, number, Minutes>(
      wrap<Days | number, number, Hours>(
        wrap<Months | number, number, Days>(
          wrap<Years, number, Months>(
            years(from.year),
            months,
            from.month
          ),
          days,
          from.day
        ),
        hours,
        from.hour
      ),
      minutes,
      from.minute
    ),
    condition
  )
}
