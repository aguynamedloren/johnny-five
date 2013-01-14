var five = require("johnny-five"),
    board, led;

board = new five.Board();

board.on("ready", function() {

  // Create a standard `led` on pin 13
  led = new five.Led(13);

	console.log('board is read!!')

  // "strobe" the led in 100ms on-off phases
  led.strobe(500);
});