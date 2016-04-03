/* eslint-disable no-console, one-var */
'use strict';

// Hackery because Date.getMonth is zero-based.
const oldGetMonth = Date.prototype.getMonth;
Date.prototype.getMonth = function () {
    return oldGetMonth.call(this) + 1;
};

const logger = {},
    tokenRe = /{([a-zA-Z]+)}/g,
    // Will call methods on JavaScript's Date object.
    formatDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => d[dateFormatters[$1]]()),
    // Glues the sub-templates together.
    formatDisplayDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => tplFormatters[$1](d)),
    preprocess = () => {},
    postprocess = () => {},
    dateFormatters = {
        d: 'getDate',
        H: 'getHours',
        i: 'getMinutes',
        m: 'getMonth',
        s: 'getSeconds',
        ms: 'getMilliseconds',
        Y: 'getFullYear'
    };

// Set some sensible defaults.
let dateTpl = '{Y}-{m}-{d}',
    timeTpl = '{H}:{i}:{s}.{ms}',
    displayDateTpl = '[{getDateString} {getTimeString}]',
    wrapped = console || {},
    enabled = false,
    // TODO: Closure is bad here!
    tplFormatters = {
        getDateString: formatDateString(dateTpl),
        getTimeString: formatDateString(timeTpl),
        getDisplayDateString: formatDisplayDateString(displayDateTpl),
        getDisplayMethodString: method => `[${method.toUpperCase()}]`
    };

function invoke(method) {
    return function () {
        if (enabled) {
            return;
        }

        const d = new Date();

        preprocess();

        wrapped[method].apply(wrapped, [
            tplFormatters.getDisplayDateString(d),
            tplFormatters.getDisplayMethodString(method)
        ].concat(Array.from(arguments)));

        postprocess();
    };
}

for (const method of Object.keys(wrapped)) {
    logger[method] = invoke(method);
}

logger.logLevel = () => {};
logger.setDateTpl = tpl => dateTpl = tpl;
logger.setTimeTpl = tpl => timeTpl = tpl;
logger.setDisplayDateTpl = tpl => displayDateTpl = tpl;
logger.wrap = target => wrapped = target;

module.exports = logger;

