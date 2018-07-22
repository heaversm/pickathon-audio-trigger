var Gpio = require('onoff').Gpio;
var button25 = new Gpio(25, 'in', 'both');

function readGPIO(){
	button25.watch(function(err,value){
		console.log(value);
	});
}

readGPIO();
