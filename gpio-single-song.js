var Gpio = require('onoff').Gpio;
var button25 = new Gpio(25, 'in', 'both', { debounceTimeout: 10});
var isPlaying = false;
var isPaused = false;

var soundplayer = require('sound-player');
var options = {
	filename: 'audio/j01.wav',
	gain: 100,
	debug: false,
	player: 'aplay'
};
var player = new soundplayer(options);

player.on('complete',function(){
	isPlaying = false;
});

function readGPIO(){
	button25.watch(function(err,value){
		console.log(value);
		if(value == 0){
			if (!isPlaying){
				player.play();
				isPlaying = true;
			} else {
				if (isPaused){
					player.resume();
					isPaused = false;
				}
			}
		} else {
			if (isPlaying && !isPaused){
				player.pause();
				isPaused = true;
			}
		}
	});
};

readGPIO();
