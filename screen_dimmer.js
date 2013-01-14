// var http = require('http');
// 
// var server = http.createServer(function(req, res) {
//   // res.writeHead(200);
//   res.end('Hello Htttrrrrtttp');
// });
// server.listen(8080);

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/screen_dimmer.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var five = require("johnny-five"), board, slider, scalingRange;

board = new five.Board();

board.on("ready", function() {

	scalingRange = [ 0, 100 ];

	slider = new five.Sensor({
	  pin: "A0",
	  freq: 50
	});

	io.sockets.on('connection', function (socket) {

	  socket.emit('news', { hello: 'world' });

	  slider.scale( scalingRange ).on("slide", function( err, value ) {
		  socket.emit('slider', { slidevalue: Math.floor(this.value) });
	  });

	  socket.on('my other event', function (data) {
	    console.log('data from client: '+data);
	  });
	
	});

});
