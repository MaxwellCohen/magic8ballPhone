/* global $ */
'use strict';

var shake = (function () {
    var shake = {},
        watchId = null,
        options = { frequency: 30 },
        previousAcceleration = { x: null, y: null, z: null },
        shakeCallBack = null;
    
    // Start watching the accelerometer for a shake gesture
    shake.startWatch = function (onShake) {
        if (onShake) {
            shakeCallBack = onShake;
        }
        watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, options);
    };
    
    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
        if (watchId !== null) {
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;
        }
    };
    
    // Gets the current acceleration snapshot from the last accelerometer watch
    function getAccelerationSnapshot() {
        navigator.accelerometer.getCurrentAcceleration(assessCurrentAcceleration, handleError);
    }
    
    // Assess the current acceleration parameters to determine a shake
    function assessCurrentAcceleration(acceleration) {
        var accelerationChange = {};
        if (previousAcceleration.x !== null) {
            accelerationChange.x = Math.abs(previousAcceleration.x, acceleration.x);
            accelerationChange.y = Math.abs(previousAcceleration.y, acceleration.y);
            accelerationChange.z = Math.abs(previousAcceleration.z, acceleration.z);
        }
        if (accelerationChange.x + accelerationChange.y + accelerationChange.z > 20) {
            // Shake detected
            shake.stopWatch();
            if (typeof (shakeCallBack) === 'function') {
                shakeCallBack();
            }
            
            previousAcceleration = { 
                x: null, 
                y: null, 
                z: null
            };
        } else {
            previousAcceleration = {
                x: acceleration.x,
                y: acceleration.y,
                z: acceleration.z
            };
        }
    }
 
    // Handle errors here
    function handleError() {
    }
    
    return shake;
})();


var setMagic8BallSize = function(doc, outside, inside) {
    var size = Math.min(doc.width(), doc.height()) * 0.9;
    var topMargin = (doc.height() - size - $('header').height()) / 2;
    outside.width(size).height(size).css('top', topMargin);
    size = size / 2;
    inside.width(size).height(size);
};
var magic8BallAns = function() {
    var ansList = getOrginalAnsList();

    function getOrginalAnsList() {
        var orginalList = ['It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            'Don\'t count on it',
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful'
        ];
        return orginalList;
    }

    return {
        getAns: function() {
            return ansList[(Math.floor(Math.random() * ansList.length))];
        }
    };
};

var doc, outside, inside, text;
doc = $(document);

doc.ready(function() {
    outside = $('.outside');
    inside = $('.inside');
    text = $('#text');
    setMagic8BallSize(doc, outside, inside);
    

});
$(window).resize(function() {
    setMagic8BallSize(doc, outside, inside);
});

var changeAns = function() {
    shake.stopWatch();
    var ans = magic8BallAns().getAns();
    navigator.notification.vibrate(200);

    text.fadeOut(200, function() {
        text.html(ans).fadeIn(400, function(){
            setTimeout( onDeviceReady, 1500);
        });
    });
};


doc.click(changeAns);
document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        shake.startWatch(changeAns, 30 /*, onError */);
    }

