/* eslint-disable one-var */
'use strict';

// Hackery because Date.getMonth is zero-based.
// Also, pad, if needed.
const oldGetMonth = Date.prototype.getMonth;
Date.prototype.getMonth = function () {
    let months = oldGetMonth.call(this) + 1;

    return months < 10 ?
        '0' + months :
        months;
};

// Hackery to pad Date.getDate, if needed.
const oldGetDate = Date.prototype.getDate;
Date.prototype.getDate = function () {
    let days = oldGetDate.call(this);

    return days < 10 ?
        '0' + days :
        days;
};

// Hackery to pad Date.getHours, if needed.
const oldGetHours = Date.prototype.getHours;
Date.prototype.getHours = function () {
    let hrs = oldGetHours.call(this);

    return hrs < 10 ?
        '0' + hrs :
        hrs;
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

