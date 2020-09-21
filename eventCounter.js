/**
 * Event Counter class to keep track of how many events were logged. 
 */
const EVENT_TOO_OLD_SECONDS = 60 * 5; // default is 5 minutes

class EventCounter {

    constructor(evtTooOld = EVENT_TOO_OLD_SECONDS) {
        this.evtTooOld = evtTooOld;
        this.events = [];
    }

    /**
     * Log an event right now.
     */
    logEvent() {
        this.events.push(Date.now())
    }

    /**
     * Recursive binary search to find the index of the last invalid event in the array
     * according to the passed in isValid function.
     * This is used for getEventCount and deleteOldEvents to find where the old events end and the new ones begin.
     * Assumes that the events are ordered from oldest to newest. 
     * If all elements are valid, we return -1
     * @param {Date[]} events - the current events we are looking at. The size of this shrinks by half every time.
     * @param {number} curLastIdx - The last index, which only changes when we pick the bottom half of the array.
     * @param {(Date) => boolean)} isValid - A function that determines if the given date is a valid date.
     */
    findLastInvalid(events, curLastIdx, isValid) {
      if (events.length === 1) {
        return isValid(events[0]) ? curLastIdx - 1 : curLastIdx;
      }
      if (events.length === 0) {
        return curLastIdx;
      }
      const midPoint = Math.floor(events.length / 2);
      if (isValid(events[midPoint])) {
        return this.findLastInvalid(events.slice(0, midPoint), curLastIdx - (events.length - midPoint), isValid);
      } else {
        return this.findLastInvalid(events.slice(midPoint), curLastIdx, isValid);
      }
    }

    /**
     * Get the number of events that occured in a specified number of seconds ago.
     * @param {number} TimeFrame - seconds ago that we are interested in
     */
    getEventCount(timeFrame) {
      if (timeFrame < 0) {
        throw new Error('Cannot get event count less than 0 seconds ago.');
      }
      if (timeFrame > this.evtTooOld) {
        throw new Error('Cannot request event count from more than ' + this.evtTooOld.toString() + ' seconds ago.')
      }
      const requestStartTime = Date.now();
      // Delete old events so that we don't have to look through them in future iterations. This will
      // only delete events that are older than the longest allowed time, so it will not delete events that might be valid.
      this.deleteOldEvents(requestStartTime);
      function isInRange(event) {
        return event > requestStartTime - (timeFrame * 1000);
      }
      const lastInvalidIdx = this.findLastInvalid(this.events, this.events.length - 1, isInRange)
      const invalidElementCount = lastInvalidIdx + 1
      return this.events.length - invalidElementCount;
    }

    /**
     * Delete events more than evtTooOld seconds ago to avoid memory leaks.
     * This is only run when getEventCount is run.
     * If we want this to run more asynchronously to let getEventCount be faster,
     * we can run this in the background on a timer or something.
     * @param {Date} requestStartTime
     */
    deleteOldEvents(requestStartTime) {
      const evtTooOld = this.evtTooOld; // Keep in scope for function below
      function isNotTooOld(event) {
        return event > requestStartTime - (evtTooOld * 1000);
      }
      const lastInvalidIdx = this.findLastInvalid(this.events, this.events.length - 1, isNotTooOld)
      this.events = this.events.slice(lastInvalidIdx + 1);
    }
}

module.exports = EventCounter;