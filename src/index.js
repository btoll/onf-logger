/* eslint-disable no-console, no-unused-vars, one-var */
'use strict';

// Contains Date.prototype overrides.
require('./lib/Date');

const chalk = require('chalk'),
    logger = {},
    tokenRe = /{([a-zA-Z]+)}/g,
    // Will call methods on JavaScript's Date object.
    formatDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => d[dateFormatters[$1]]()),
    // Glues the sub-templates together.
    formatDisplayDateString = tpl => d => tpl.replace(tokenRe, (a, $1) => tplFormatters[$1](d)),
    // TODO
    prelog = methodName => {
        return chalk[chalkMap[methodName]](tplFormatters.getDisplayDateString(new Date())) +
            chalk[chalkMap[methodName]](tplFormatters.getDisplayMethodString(methodName));
    },
    postlog = methodName => '',
    preprocess = methodName => '',
    postprocess = methodName => '',
    aliases = {
        debug: 'info',
        fatal: 'error'
    },
    dateFormatters = {
        d: 'getDate',
        H: 'getHours',
        i: 'getMinutes',
        m: 'getMonth',
        s: 'getSeconds',
        ms: 'getMilliseconds',
        Y: 'getFullYear'
    },
    chalkMap = {
        debug: 'cyan',
        error: 'red',
        fatal: 'bgRed',
        info: 'blue',
        log: 'green',
        warn: 'yellow'
    };

// Set some sensible defaults.
let dateTpl = '{Y}-{m}-{d}',
    timeTpl = '{H}:{i}:{s}.{ms}',
    displayDateTpl = '[{getDateString} {getTimeString}]',
    wrapped = console || {},
    disabled = false,
    // TODO: Closure is bad here!
    tplFormatters = {
        getDateString: formatDateString(dateTpl),
        getTimeString: formatDateString(timeTpl),
        getDisplayDateString: formatDisplayDateString(displayDateTpl),
        // TODO
        getDisplayMethodString: methodName => `[${methodName.toUpperCase()}]`
    };

function invoke(methodName) {
    return function () {
        if (disabled) {
            return;
        }

        preprocess(methodName);

        // Check first if it's an alias so an actual underlying implementation is called!
        wrapped[ aliases[methodName] || methodName ].apply(wrapped, [ prelog(methodName) ]
            .concat(Array.from(arguments))
            .concat([ postlog(methodName) ]));

        postprocess(methodName);
    };
}

for (const methodName of Object.keys(wrapped)) {
    logger[methodName] = invoke(methodName);
}

for (const alias of Object.keys(aliases)) {
    logger[alias] = invoke(alias);
}

// Allow access to underlying wrapped logger object.
logger.__get = () => wrapped;
logger.disable = () => disabled = true;
logger.enable = () => disabled = false;
// TODO
logger.logLevel = () => {};
logger.setDateTpl = tpl => dateTpl = tpl;
logger.setTimeTpl = tpl => timeTpl = tpl;
logger.setDisplayDateTpl = tpl => displayDateTpl = tpl;
logger.wrap = target => wrapped = target;

module.exports = logger;

