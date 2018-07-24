var Gpio = require('onoff').Gpio;
var soundplayer = require('sound-player');

var doDebug = false;
var gain = 100;
var debounceTime = 10;

var pinArray = [
    {
        pin: 23, //GPIO pin
        track: 'j01.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 24, //GPIO pin
        track: 'j02.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 25, //GPIO pin
        track: 'j03.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 12, //GPIO pin
        track: 'j04.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 16, //GPIO pin
        track: 'j05.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 20, //GPIO pin
        track: 'j06.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 21, //GPIO pin
        track: 'j07.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    },
    {
        pin: 26, //GPIO pin
        track: 'j08.wav', //track name in audio directory
        isPlaying: false, //is the gpio trigger active?
        isPaused: false, //is the track paused
        trigger: null, //ref that will be added to gpio / onoff library
        player: null, //player instance for this pin
    }
];

function init() {
    configurePins();
};

function configurePins(){
    for (var i = 0; i < pinArray.length; i++) {
        var thisPin = pinArray[i];
        var trigger = new Gpio(thisPin.pin, 'in', 'both', { debounceTimeout: debounceTime });
        trigger.id = i;
        thisPin.trigger = trigger;
        trigger.watch((err, value)=> {
            handleTriggerUpdate(trigger.id, err, value);
        });

        var options = {
            filename: `audio/${thisPin.track}`,
            gain: gain,
            debug: doDebug,
            player: 'aplay'
        };
        var player = new soundplayer(options);
        player.id = i;
        thisPin.player = player;
    }
}

function handlePlaybackComplete(i) {
    pinArray[i].player.play();
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
