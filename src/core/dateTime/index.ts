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
      yield { year: year++ }
    }
  }
  function * months ({ month }: Months, { year }: Years) {
    while (month < 12) {
      yield { month: month++, year }
    }
    return { month: month % 12, year }
  }
  function * days ({ day }: Days, { month, year }: Months) {
    const len = getMonthLength(year, month)
    while (day < len) {
      yield { day: day++, month, year }
    }
    return { day: day % len, month, year }
  }
  function * hours ({ hour }: Hours, date: Days) {
    while (hour < 24) {
      yield { hour: hour++, ...date }
    }
    return { hour: hour % 60, ...date }
  }
  function * minutes ({ minute }: Minutes, date: Hours) {
    while (minute < 60) {
      yield { minute: minute++, ...date }
    }
    return { minute: minute % 60, ...date }
  }
  const from = toMinutes(begin)

  const period = wrap(
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
