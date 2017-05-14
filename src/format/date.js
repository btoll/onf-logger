'use strict';

// Left-pad for a more pleasing presentation.
const augmenter = num =>
    num < 10 ? '0' + num : num;

const oldGetMonth = Date.prototype.getMonth;
const oldGetDate = Date.prototype.getDate;
const oldGetHours = Date.prototype.getHours;
const oldGetMinutes = Date.prototype.getMinutes;
const oldGetSeconds = Date.prototype.getSeconds;

Date.prototype.getMonth = function () {
    // #getMonth is zero-based.
    return augmenter(oldGetMonth.call(this) + 1);
};

Date.prototype.getDate = function () {
    return augmenter(oldGetDate.call(this));
};

Date.prototype.getHours = function () {
    return augmenter(oldGetHours.call(this));
};

Date.prototype.getMinutes = function () {
    return augmenter(oldGetMinutes.call(this));
};

Date.prototype.getSeconds = function () {
    return augmenter(oldGetSeconds.call(this));
};

let displayDateTpl = '[{getDateString} {getTimeString}]';
let dateTpl = '{Y}-{m}-{d}';
let timeTpl = '{H}:{i}:{s}.{ms}';

const base = require('./base');
const tokenRe = /{([a-zA-Z]+)}/g;

// Will call methods on JavaScript's Date object.
const formatDateString = tpl =>
    d => tpl.replace(tokenRe, (a, $1) => d[dateObjectMethods[$1]]());

const tpls = {
    getDateString: formatDateString(dateTpl),
    getTimeString: formatDateString(timeTpl)
};

const dateObjectMethods = {
    d: 'getDate',
    H: 'getHours',
    i: 'getMinutes',
    m: 'getMonth',
    s: 'getSeconds',
    ms: 'getMilliseconds',
    Y: 'getFullYear'
};

// Glues the sub-templates together.
const getDisplayDateString = () => {
    const d = new Date();
    return displayDateTpl.replace(tokenRe, (a, $1) => tpls[$1](d));
};

module.exports = Object.setPrototypeOf({
    prelog: (logMethodName, isColorEnabled, isDateEnabled) => {
        const dateDisplayString = !isDateEnabled ?
            '' :
            `${getDisplayDateString()} `;

        return `${dateDisplayString}${base.prelog(logMethodName, isColorEnabled)}`;
    },

    getDateTpl: () => dateTpl,

    setDateTpl: tpl => (
        dateTpl = tpl,
        tpls.getDateString = formatDateString(tpl)
    ),

    getTimeTpl: () => timeTpl,

    setTimeTpl: tpl => (
        timeTpl = tpl,
        tpls.getTimeString = formatDateString(tpl)
    )
}, base);

