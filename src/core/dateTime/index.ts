import {
  buildIterable,
  handle,
  wrap
} from 'iterator-wrapper'

import {
  getMonthLength,
  toDateTime,
  IDateTime
} from './dateHelper'

export * from './dateHelper'

const years = buildIterable<IDateTime>((): boolean => true)
const months = buildIterable<IDateTime>(({ month }): boolean => month < 12)
const days = buildIterable<IDateTime>(({ year, month, day }): boolean => day < getMonthLength(year, month))
const hours = buildIterable<IDateTime>(({ hour }): boolean => hour < 24)
const minutes = buildIterable<IDateTime>(({ minute }): boolean => minute < 60)

const iterable = wrap(
  wrap(
    wrap(
      wrap(years, months, ({ year, month, ...rest }) => ({ year: year + Math.floor(month / 12), month: month % 12, ...rest })),
      days,
      ({ year, month, day, ...rest }) => {
        const len = getMonthLength(year, month)
        return { year, month: month + Math.floor(day / len), day: day % len, ...rest }
      }
    ),
    hours,
    ({ day, hour, ...rest }) => ({ day: day + Math.floor(hour / 24), hour: hour % 24, ...rest })
  ),
  minutes,
  ({ hour, minute, ...rest }) => ({ hour: hour + Math.floor(minute / 60), minute: minute % 60, ...rest })
)

export default (date: Date, available: (value: IDateTime) => boolean, step: number) => {
  const iterator = handle(iterable, ({ minute, ...rest }) => ({ minute: minute + step, ...rest }))
  return iterator(toDateTime(date), available)
}
