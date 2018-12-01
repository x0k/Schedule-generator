System.register("src/iterator/DateTime", [], function (exports_1, context_1) {
    "use strict";
    var DateTime;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            DateTime = class DateTime {
                constructor(begin) {
                    this.begin = begin;
                    this.year = begin.getFullYear();
                    this.month = begin.getMonth() + 1;
                    this.week = 1;
                    this.date = begin.getDate();
                    this.hours = begin.getHours();
                    this.minutes = begin.getMinutes();
                    const day = begin.getDay();
                    this.day = day > 0 ? day : 7;
                }
                static leapYear(year) {
                    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                }
                static getMonthLength(year, month) {
                    // tslint:disable-next-line:no-bitwise
                    return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
                }
                static getTimeBethwen(begin, end) {
                    return end.getTime() - begin.getTime();
                }
                static toSeconds(milliseconds) {
                    return milliseconds / 1000;
                }
                static toMinutes(milliseconds) {
                    return milliseconds / 60000;
                }
                static toHours(milliseconds) {
                    return milliseconds / 3600000;
                }
                static toDays(milliseconds) {
                    return milliseconds / 86400000;
                }
                static toWeeks(milliseconds) {
                    return milliseconds / 604800000;
                }
                before(date) {
                    if (this.year < date.getFullYear()
                        || (this.year === date.getFullYear() && this.month < date.getMonth() + 1)
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1 && this.date < date.getDate())
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
                            && this.date === date.getDate() && this.hours < date.getHours())
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
                            && this.date === date.getDate() && this.hours === date.getHours() && this.minutes < date.getMinutes())) {
                        return true;
                    }
                    return false;
                }
                after(date) {
                    if (this.year > date.getFullYear()
                        || (this.year === date.getFullYear() && this.month > date.getMonth() + 1)
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1 && this.date > date.getDate())
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
                            && this.date === date.getDate() && this.hours > date.getHours())
                        || (this.year === date.getFullYear() && this.month === date.getMonth() + 1
                            && this.date === date.getDate() && this.hours === date.getHours() && this.minutes > date.getMinutes())) {
                        return true;
                    }
                    return false;
                }
                isToday(date) {
                    return (this.date === date.getDate()) && (this.month === date.getMonth() + 1) && (this.year === date.getFullYear());
                }
                next(level) {
                    this.addMinute(level);
                    return this;
                }
                toDate() {
                    return new Date(this.year, this.month - 1, this.date, this.hours, this.minutes);
                }
                toString() {
                    return `${this.year} ${this.month} ${this.date} ${this.hours} ${this.minutes}`;
                }
                addYear(level) {
                    this.year++;
                    level('years', this);
                }
                addMonth(level) {
                    if (this.month < 12) {
                        this.month++;
                    }
                    else {
                        this.month = 1;
                        this.addYear(level);
                    }
                    level('months', this);
                }
                addDate(level) {
                    // Day
                    if (this.day < 7) {
                        this.day++;
                    }
                    else {
                        this.day = 1;
                        this.week++;
                        level('weeks', this);
                    }
                    // Date
                    if (this.date < DateTime.getMonthLength(this.year, this.month)) {
                        this.date++;
                    }
                    else {
                        this.date = 1;
                        this.addMonth(level);
                    }
                    level('days', this);
                }
                addHours(level) {
                    if (this.hours < 23) {
                        this.hours++;
                    }
                    else {
                        this.hours = 0;
                        this.addDate(level);
                    }
                    level('hours', this);
                }
                addMinute(level) {
                    if (this.minutes < 59) {
                        this.minutes++;
                    }
                    else {
                        this.minutes = 0;
                        this.addHours(level);
                    }
                    level('minutes', this);
                    level('dateTime', this);
                }
            };
            exports_1("default", DateTime);
        }
    };
});
System.register("src/iterator/Event", [], function (exports_2, context_2) {
    "use strict";
    var Event;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Event = class Event {
                constructor(handler) {
                    this.handler = handler;
                    this.listners = [];
                }
                addListner(name) {
                    this.listners.push(name);
                }
            };
            exports_2("default", Event);
        }
    };
});
System.register("src/iterator/DateTimeEvent", ["src/iterator/Event"], function (exports_3, context_3) {
    "use strict";
    var Event_1, DateTimeEvent;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (Event_1_1) {
                Event_1 = Event_1_1;
            }
        ],
        execute: function () {
            DateTimeEvent = class DateTimeEvent extends Event_1.default {
                constructor(handler, level) {
                    super(handler);
                    this.level = level;
                }
            };
            exports_3("DateTimeEvent", DateTimeEvent);
        }
    };
});
System.register("src/iterator/EventProvider", [], function (exports_4, context_4) {
    "use strict";
    var EventProvider;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            EventProvider = class EventProvider {
                constructor(events) {
                    this.values = {};
                    this.events = {};
                    for (const eventName of Object.keys(events)) {
                        const event = events[eventName];
                        this.addEvent(eventName, event);
                    }
                }
                addEvent(name, event) {
                    this.events[name] = event;
                }
                hasEvent(name) {
                    return name in this.events;
                }
                getEvent(name) {
                    return this.events[name];
                }
                emit(name, ...args) {
                    const event = this.events[name];
                    this.values[name] = event.handler(this.values, ...args);
                    for (const eventName of event.listners) {
                        this.emit(eventName, ...args);
                    }
                }
            };
            exports_4("default", EventProvider);
        }
    };
});
System.register("src/iterator/DateTimeIterator", ["src/iterator/DateTime", "src/iterator/DateTimeEvent", "src/iterator/EventProvider"], function (exports_5, context_5) {
    "use strict";
    var DateTime_1, DateTimeEvent_1, EventProvider_1, DateTimeIterator;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (DateTime_1_1) {
                DateTime_1 = DateTime_1_1;
            },
            function (DateTimeEvent_1_1) {
                DateTimeEvent_1 = DateTimeEvent_1_1;
            },
            function (EventProvider_1_1) {
                EventProvider_1 = EventProvider_1_1;
            }
        ],
        execute: function () {
            DateTimeIterator = class DateTimeIterator extends EventProvider_1.default {
                constructor() {
                    super({
                        dateTime: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt, 0),
                        minutes: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.minutes, 0),
                        hours: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.hours, 1),
                        days: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.date, 2),
                        day: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.day, 2),
                        weeks: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.week, 3),
                        months: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.month, 4),
                        years: new DateTimeEvent_1.DateTimeEvent((v, dt) => dt.year, 5),
                    });
                }
                getEvent(name) {
                    return super.getEvent(name);
                }
                start(begin, end) {
                    const dateTime = new DateTime_1.default(begin), onChange = this.emit.bind(this);
                    // Init values
                    const events = ['dateTime', 'minutes', 'hours', 'days', 'day', 'weeks', 'months', 'years'];
                    for (const name of events) {
                        this.emit(name, dateTime, this.values);
                    }
                    // Start
                    while (dateTime.before(end)) {
                        dateTime.next(onChange);
                    }
                }
                addListner(name, listner) {
                    let target = null;
                    // Check required events and define target
                    for (const eventName of listner.require) {
                        if (this.hasEvent(eventName)) {
                            const event = this.getEvent(eventName);
                            if (!target) {
                                target = event;
                            }
                            else if (event.level <= target.level) {
                                target = event;
                            }
                        }
                        else {
                            throw new Error(`Required event: ${event} - not found.`);
                        }
                    }
                    if (target) {
                        target.addListner(name);
                    }
                    else {
                        target = new DateTimeEvent_1.DateTimeEvent(null, Number.MAX_VALUE);
                    }
                    this.addEvent(name, new DateTimeEvent_1.DateTimeEvent(listner.handler, target.level));
                }
            };
            exports_5("default", DateTimeIterator);
        }
    };
});
System.register("src/solver", ["src/iterator/DateTimeIterator"], function (exports_6, context_6) {
    "use strict";
    var DateTimeIterator_1, Solver;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (DateTimeIterator_1_1) {
                DateTimeIterator_1 = DateTimeIterator_1_1;
            }
        ],
        execute: function () {
            Solver = class Solver {
                constructor() {
                    this.iterator = new DateTimeIterator_1.default();
                }
                run(begin, end, event) {
                    const data = [];
                    this.iterator.addListner('solver', {
                        require: ['subjects'],
                        handler: (v) => data.push(v),
                    });
                    this.iterator.start(begin, end);
                    return data;
                }
            };
            exports_6("default", Solver);
        }
    };
});
System.register("index", ["src/solver"], function (exports_7, context_7) {
    "use strict";
    var solver_1;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (solver_1_1) {
                solver_1 = solver_1_1;
            }
        ],
        execute: function () {
            exports_7("Solver", solver_1.default);
        }
    };
});
