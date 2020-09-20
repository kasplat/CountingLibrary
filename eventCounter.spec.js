'use strict';

var EventCounter = require('./eventCounter');


const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let evtctr;
beforeEach(() => {
    evtctr = new EventCounter();
})

it('Throws when given negative seconds', () => {
    expect(() => {evtctr.getEventCount(-1)}).toThrow('Cannot get event count less than 0 seconds ago.');
})

it('Throws when given too many seconds', () => {
    expect(() => {evtctr.getEventCount(301)}).toThrow('Cannot request event count from more than 300 seconds ago.');
})

it('Works with 0 events', () => {
    expect(evtctr.getEventCount(10)).toBe(0);
});

it('Works with many events', () => {
    for (let i = 0; i < 100; i++) {
        evtctr.logEvent();
    }
    expect(evtctr.getEventCount(10)).toBe(100);
})

it('Will catch an event a few deciseconds old and wont catch ones that are too old.', async done => {
    for (let i = 0; i < 10; i++) {
        evtctr.logEvent();
    }
    await wait(1.5 * 100);
    expect(evtctr.getEventCount(.2)).toBe(10);
    for (let i = 0; i < 20; i++) {
        evtctr.logEvent();
    }
    await wait(1.5 * 100);
    expect(evtctr.getEventCount(.2)).toBe(20);
    done();
});

it('Deletes events that are too old', async () => {
    const shortTimeoutEvtTimer = new EventCounter(1);
    shortTimeoutEvtTimer.logEvent();
    shortTimeoutEvtTimer.logEvent();
    await wait(2 * 1000);
    shortTimeoutEvtTimer.logEvent();
    shortTimeoutEvtTimer.deleteOldEvents(new Date());
    expect(shortTimeoutEvtTimer.events.length).toBe(1);
})
