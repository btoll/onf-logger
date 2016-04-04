/* eslint-disable one-var */
'use strict';

// Hackery because Date.getMonth is zero-based.
const oldGetMonth = Date.prototype.getMonth;
Date.prototype.getMonth = function () {
    return oldGetMonth.call(this) + 1;
};

// Hackery to pad Date.getMinutes, if needed.
const oldGetMinutes = Date.prototype.getMinutes;
Date.prototype.getMinutes = function () {
    let mins = oldGetMinutes.call(this);

    return mins < 10 ?
        '0' + mins :
        mins;
};

// Hackery to pad Date.getSeconds, if needed.
const oldGetSeconds = Date.prototype.getSeconds;
Date.prototype.getSeconds = function () {
    let secs = oldGetSeconds.call(this);

    return secs < 10 ?
        '0' + secs :
        secs;
};

