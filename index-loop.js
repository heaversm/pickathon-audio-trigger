var Gpio = require('onoff').Gpio;
var soundplayer = require('sound-player');

var doDebug = false;
var gain = 100;
var debounceTime = 10;

var pinArray = [
    {
        pin: 25,
        track: 'j01.wav',
        isPlaying: false,
        isPaused: false,
        trigger: null,
        player: null,
    }
];

function init() {
    configurePins();
};

function configurePins(){
    for (var i = 0; i < pinArray.length; i++) {
        var thisPin = pinArray[i];
        var trigger = new Gpio(thisPin.pin, 'in', 'both', { debounceTimeout: debounceTime });
        trigger.id = i; //MH - need to be able to reference this later to reference correct trigger
        thisPin.trigger = trigger;
        trigger.watch(function(err, value) {
	    console.log(this);
            handleTriggerUpdate(i, err, value);
        });

        var options = {
            filename: `audio/${thisPin.track}`,
            gain: gain,
            debug: doDebug,
            player: 'aplay'
        };
        var player = new soundplayer(options);
        player.id = i; //MH - need to be able to reference this later to reference correct player
        player.on('complete', (i) => {
            handlePlaybackComplete(i);
        });
        thisPin.player = player;
    }
}

function handlePlaybackComplete(i) {
    console.log('complete', i);
    pinArray[i].isPlaying = false;
    //MH - trigger playback here, or configure looping from library -l flag so we don't need to monitor completion?
}

function handleTriggerUpdate(i, err, value) {
    var thisPin = pinArray[i];
    if (value == 0) {
        if (!thisPin.isPlaying) {
            thisPin.player.play();
            thisPin.isPlaying = true;
        } else {
            if (thisPin.isPaused) {
                thisPin.player.resume();
                thisPin.isPaused = false;
            }
        }
    } else {
        if (thisPin.isPlaying && !thisPin.isPaused) {
            thisPin.player.pause();
            thisPin.isPaused = true;
        }
    }
}



init();
