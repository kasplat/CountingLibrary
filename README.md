# CountingLibrary

Event Counter is a Javascript library for tracking events.

## Installation

Install npm dependencies and include the eventCounter.js file in your application.

```bash
npm i
```

## Usage

```javascript
var EventCounter = require('./eventCounter');

const evtctr = new EventCounter();

evtctr.logEvent(); // Log an event

evtctr.getEventCount(2); // Get number of events logged in the last 2 seconds, returns 1.

```

## Running tests

Testing is done by [jest](https://jestjs.io/), a popular javascript testing framework. 

```bash
npm test
```

## Assumptions

The software assumes a fairly general use case. The assumptions and design results are as follows:
- Logging events will be called much more frequently than getting events. This means deletion of old events is placed on the getEvent call.
- The library will be used synchronously. If the logEvent function is called multiple times at once in an async context, then the internal array containing the events might not be in order, and therefore the getEventCounter might return slightly incorrect results.
- The event array logged can be stored in a small portion of the memory. We expect in the millions of calls at max. The event array is copied over to a new array instead of being in place.
- getEventCount will be called with some regularity. Right now, deletion of old events is tied to getEventCount.
- We are only concerned with big O speed. Currently getEventCount is 2*O(log(events)) because we run the deletion event followed by getEventCount, but we could combine the two events to save a bit of time if it is a significant improvement.

## License
[MIT](https://choosealicense.com/licenses/mit/)