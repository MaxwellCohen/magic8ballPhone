/*
from https://github.com/leecrossley/cordova-plugin-shake

The MIT License (MIT)
Copyright © 2015 Lee Crossley <leee@hotmail.co.uk>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/


/*jshint unused: false */
'use strict';
module.exports = (function () {
    "use strict";
    var shake = {};

    var watchId = null;

    var options = {
        frequency: 30
    };

    var previousAcceleration = {
        x: null,
        y: null,
        z: null
    };

    var shakeCallBack = null;
    var sensitivity = 30;

    // Start watching the accelerometer for a shake gesture
    shake.startWatch = function (onShake, _sensitivity, onError) {
        if (typeof (onShake) !== "function") {
            return;
        }

        if (typeof (_sensitivity) === "number") {
            sensitivity = _sensitivity;
        }

        shakeCallBack = debounce(onShake);

        watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
    };

    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
        if (watchId !== null) {
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;

            previousAcceleration = {
                x: null,
                y: null,
                z: null
            };
        }
    };

    // Assess the current acceleration parameters to determine a shake
    var assessCurrentAcceleration = function (acceleration) {
        var accelerationChange = {};
        if (previousAcceleration.x !== null) {
            accelerationChange.x = Math.abs(Math.floor(previousAcceleration.x - acceleration.x));
            accelerationChange.y = Math.abs(Math.floor(previousAcceleration.y - acceleration.y));
            accelerationChange.z = Math.abs(Math.floor(previousAcceleration.z - acceleration.z));
        }

        previousAcceleration = {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z
        };

        if (accelerationChange.x + accelerationChange.y + accelerationChange.z > sensitivity) {
            // Shake detected
            shakeCallBack();
        }
    };

    // Prevent duplicate shakes within 750ms
    var debounce = function (onShake) {
        var timeout;
        return function () {
            if (timeout) {
                return;
            }

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                timeout = null;
            }, 750);

            onShake();
        };
    };

    return shake;
})();