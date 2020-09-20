var http = require('http');

var EventCounter = require('./eventCounter');

console.log('Starting Server');
const evtctr = new EventCounter();
http.createServer(function (req, res) {

    if (req.method === "GET") {
      console.log('get request');
      evtctr.logEvent();
    }

    res.write('Current events: ' + evtctr.events); //write a response to the client
    
    if (req.method === 'POST') {
      console.log('POST request being made');
      const evtCount = evtctr .getEventCount(parseInt(req.url.split('=')[1]));
      res.write(evtCount.toString(), ' events occured in the specified timeframe')
    }

    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

