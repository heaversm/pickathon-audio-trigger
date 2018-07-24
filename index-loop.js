var Gpio = require('onoff').Gpio;
var soundplayer = require('sound-player');

var doDebug = false;
var gain = 100;
var debounceTime = 10;

var pinArray = [
    {
        pin: 25, //GPIO pin
        track: 'j01.wav', //track name in audio directory
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
        trigger.id = i; //MH - need to be able to reference this later to reference correct trigger
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
        player.id = i; //MH - need to be able to reference this later to reference correct player
        /*player.on('complete', () => {
            handlePlaybackComplete(player.id);
        });*/
        thisPin.player = player;
    }
}

function handlePlaybackComplete(i) {
    console.log('complete', i);
    pinArray[i].player.play();
}

function handleTriggerUpdate(i, err, value) {
    console.log(i);
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
