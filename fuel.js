var express = require('express'), 
	app = express(),
	server = require('http').createServer(app), 
	io = require('socket.io').listen(server);

server.listen(8080);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/fuel.html');
});

var five = require("johnny-five"), board, slider, scalingRange;

board = new five.Board();

board.on("ready", function() {

	scalingRange = [ 0, 90 ];

	slider = new five.Sensor({
	  pin: "A0",
	  freq: 50
	});
	
	led = new five.Led(11);
	
	leftButton = new five.Button(2);
	
	rightButton = new five.Button(4);
	

	io.sockets.on('connection', function (socket) {
		
		led.off();						
					
		// send starting value to the client
	 	socket.emit('slider', { slidevalue: Math.floor(slider.scale(scalingRange).value) });
			
		slider.scale( scalingRange ).on("slide", function( err, value ) {
		 socket.emit('slider', { slidevalue: Math.floor(this.value) });
		});
		
		socket.on('led-on', function (data) {
		 led.strobe(400);
		});

		socket.on('led-stop', function (data) {
		 led.stop();
		});

		socket.on('led-off', function (data) {
		 led.off();
		});
		
		socket.on('led-toggle', function (data) {
		 led.toggle();
		});
		
		leftButton.on("down", function() {
			console.log('left button down');
			socket.emit('left-button-down');
		});

		leftButton.on("up", function() {
			console.log('left button up');
			socket.emit('left-button-up');
		});
		
		rightButton.on("down", function() {
			socket.emit('right-button-down');
		});
		
		rightButton.on("up", function() {
			socket.emit('right-button-up');
		});

	});

});
