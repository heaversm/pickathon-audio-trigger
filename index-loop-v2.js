var Gpio = require('onoff').Gpio;
var soundplayer = require('sound-player');

var doDebug = false;
var gain = 100;
var debounceTime = 10;

var pinArray = [
    {
        pin: 23, //GPIO pin
        track: 'j01.wav', //track name in audio directory
    },
    {
        pin: 24, //GPIO pin
        track: 'j02.wav', //track name in audio directory
    },
    {
        pin: 25, //GPIO pin
        track: 'j03.wav', //track name in audio directory
    },
    {
        pin: 12, //GPIO pin
        track: 'j04.wav', //track name in audio directory
    },
    {
        pin: 16, //GPIO pin
        track: 'j05.wav', //track name in audio directory
    },
    {
        pin: 20, //GPIO pin
        track: 'j06.wav', //track name in audio directory
    },
    {
        pin: 21, //GPIO pin
        track: 'j07.wav', //track name in audio directory
    },
    {
        pin: 26, //GPIO pin
        track: 'j08.wav', //track name in audio directory
    }
];

function init() {
    for (var i = 0; i < pinArray.length; i++) {
        configurePin(i);
    }
};

function configurePin(i){
    var thisPin = pinArray[i];
    var trigger = new Gpio(thisPin.pin, 'in', 'both', { debounceTimeout: debounceTime });
    var isPlaying = false;
    var isPaused = false;

    function handleTriggerUpdate(err, value) {
        if (value == 0) {
            if (!isPlaying) {
                player.play();
                isPlaying = true;
            } else {
                if (isPaused) {
                    player.resume();
                    isPaused = false;
                }
            }
        } else {
            if (isPlaying && !isPaused) {
                player.pause();
                isPaused = true;
            }
        }
    }

    function handlePlaybackComplete() {
        player.play();
    }

    trigger.watch(handleTriggerUpdate);

    var options = {
        filename: `audio/${thisPin.track}`,
        gain: gain,
        debug: doDebug,
        player: 'aplay'
    };

    var player = new soundplayer(options);
    player.on('complete', handlePlaybackComplete);
}

init();
