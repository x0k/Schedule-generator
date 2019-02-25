
export function* datePart (value: number, getLimit: (value: number) => number, step: IterableIterator<number>) {
  do {
    yield value += yield step;
    const limit = getLimit(value);
    if (value >= limit) {
      value %= limit;
    }
  } while (true);
}

for (const date of datePart(2000, () => Number.MAX_VALUE,
  datePart(1, () => 12,
    datePart(1, (month) => 31,
      datePart(1, () => 24,
        datePart(1, () => 60, datePart(0, () => 1))))))) {
          
        } 