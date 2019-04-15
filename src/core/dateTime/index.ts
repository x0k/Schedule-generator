import { wrap, restrict } from 'iterator-wrapper'

import {
  Years,
  Months,
  Days,
  Hours,
  Minutes,
  years,
  months,
  days,
  hours,
  minutes,
  isNumber
} from './dateParts'

function toMinutes (date: Date): Minutes {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export default (begin: Date, end: Date) => {
  const condition = (date: Minutes | number) => !isNumber(date) && (
    date.year < end.getFullYear() ||
    date.month < end.getMonth() ||
    date.day < end.getDate() ||
    date.hour < end.getHours() ||
    date.minute <= end.getMinutes()
  )
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
