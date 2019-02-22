export type TOnChangeEvent = (value: number) => void;

export function* datePart (onChange: TOnChangeEvent, value: number, step: number, getLimit = () => Number.MAX_VALUE) {
  do {
    value += step;
    const limit = getLimit();
    if (value >= limit) {
      yield Math.floor(value / limit);
      value %= limit;
    }
    onChange(value);
  } while (true);
}
