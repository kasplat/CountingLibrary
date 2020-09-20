
const EVENT_TOO_OLD_SECONDS = 60 * 5;

class EventCounter {
    constructor(evtTooOld = EVENT_TOO_OLD_SECONDS) {
        this.evtTooOld = evtTooOld;
        this.events = [];
    }

    logEvent() {
        this.events.push(Date.now())
    }

    /**
     * Binary search to find the index of the last invalid event in the array. 
     * Assumes that the events are from least to most recent. 
     * If all elements are valid, we return -1
     * @param {events we are currently looking at} events 
     * @param {the index of this event slice in the actual events} curLastIdx 
     * @param {function to determine if an elemnt is valid} isValid 
     */
    findLastInvalid(events, curLastIdx, isValid) {
      console.log('events.lenght: ', events.length);
      console.log('curLastIdx: ', curLastIdx);
      if (events.length === 1) {
        console.log('last el is valid: ', isValid(events[0]));
        return isValid(events[0]) ? curLastIdx - 1 : curLastIdx;
      }
      if (events.length === 0) {
        return -1;
      }
      let midPoint = Math.floor(events.length / 2);
      console.log('midpt is valid: ', isValid(events[midPoint]));
      console.log('midpt: ', midPoint);
      if (isValid(events[midPoint])) {
        return this.findLastInvalid(events.slice(0, midPoint), curLastIdx - (events.length - midPoint), isValid);
      } else {
        return this.findLastInvalid(events.slice(midPoint), curLastIdx, isValid);
      }
    }

    /**
     * Get the number of events in a specified number of seconds ago.
     * @param {timeFrame} number of seconds ago
     */
    getEventCount(timeFrame) {
      if (timeFrame < 0) {
        throw new Error('Cannot get event count less than 0 seconds ago.');
      }
      if (timeFrame > this.evtTooOld) {
        throw new Error('Cannot request event count from more than 5 minutes ago.')
      }
      let requestStartTime = Date.now();
      this.deleteOldEvents(requestStartTime, timeFrame);
      function isInRange(event) {
        return event > requestStartTime - (timeFrame * 1000);
      }
      const lastInvalidIdx = this.findLastInvalid(this.events, this.events.length - 1, isInRange)
      const invalidElementCount = lastInvalidIdx + 1
      return this.events.length - invalidElementCount;
      // let i = this.events.length - 1;
      // let evtCount = 0;
      // while (i >= 0) {
      //   let curEvent = this.events[i];
      //   if (requestStartTime - (timeFrame * 1000) < curEvent) {
      //     evtCount++;
      //   } else {
      //     break;
      //   }
      //   i--;
      // }
      // console.log('in the last ', timeFrame, ' seconds, ', evtCount, ' events occured.');
      // return evtCount;
    }

    deleteOldEvents(requestStartTime) {
      const evtTooOld = this.evtTooOld; // Keep in scope for function below
      function isNotTooOld(event) {
        return event > requestStartTime - (evtTooOld * 1000);
      }
      let lastInvalidIdx = this.findLastInvalid(this.events, this.events.length - 1, isNotTooOld)
      console.log('this events before: ', this.events);
      this.events = this.events.slice(lastInvalidIdx + 1);
      // let i = this.events.length - 1;
      // while (i < this.events.length) {
      //   console.log('evtTooOld: ', this.evtTooOld);
      //   console.log('on event: ', i);
      //   let curEvent = this.events[i];
      //   console.log('curEvent: ', curEvent);
      //   console.log('requestStartTime: ', requestStartTime);
      //   // If we are 5 minutes before the request time and still greater than the curEvent, then stop slice here.
      //   if (requestStartTime - (this.evtTooOld * 1000) > curEvent) {
      //     break;
      //   }
      //   i++;
      // }
      // this.events = this.events.slice(i);
    }
}

module.exports = EventCounter;