import test from 'ava';

import * as Helper from '../build/core/helpers/dateHelper';

import { DateTime } from '../build/core/dateTime';

import { Interpreter } from '../build/core/interpreter';

const now = new Date();
const tomorrow = new Date(now.getTime() + Helper.day);
const dateTime = new DateTime(now, tomorrow, {});
const interpreter = new Interpreter({ dateTime });

test('Date operations', t => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const data = [ year, month, date - 1, 'fullDate', year, month, date + 1, 'fullDate', 'in' ];
  const handler = interpreter.toHandler(data);
  t.true(handler());
});