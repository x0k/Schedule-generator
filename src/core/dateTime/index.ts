import {
  decorate,
  wrap
} from 'iterator-wrapper'

import {
  getMonthLength,
  toDateTime,
  IDateTime
} from './dateHelper'

export interface Steps {
  minute: number
  hour: number
  day: number
  month: number
  year: number
}

export * from './dateHelper'

const iterable = (key: string, lim: number, step: number = 1) => function * (value: number, date: any) {
  while (value < lim) {
    yield { [key]: value, ...date }
    value += step
  }
  return value % lim
}

export default (begin: Date, end: Date, steps: IDateTime) => {
  const condition = ({ year, month, day, hour, minute }: IDateTime) => year < end.getFullYear() ||
    month < end.getMonth() ||
    day < end.getDate() ||
    hour < end.getHours() ||
    minute <= end.getMinutes()
  const years = iterable('year', 4000, steps.year)
  const months = iterable('month', 12, steps.month)
  function * days (value: number, date: any) {
    const { year, month, ...rest } = date
    const len = getMonthLength(year, month)
    while (value < len) {
      yield { year, month, day: value, ...rest }
      value += steps.day
    }
    return value % len
  }
  const hours = iterable('hour', 24, steps.hour)
  const minutes = iterable('minute', 60, steps.minute)
  const from = toDateTime(begin)
  const period = decorate<IDateTime>(
    decorate<IDateTime>(
      decorate<IDateTime>(
        decorate<IDateTime>(
          years(from.year, {}),
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
  )
  return wrap<IDateTime>(period, condition)
}
