'use strict';

// Contains Date.prototype overrides.
require('../lib/Date');

const chalk = require('chalk'),
    chalkMap = {
        debug: 'cyan',
        error: 'red',
        fatal: 'bgRed',
        info: 'blue',
        log: 'green',
        warn: 'yellow'
    },

    colorize = (methodName, str) => chalk[chalkMap[methodName]](str),
    getDisplayMethodString = methodName => `[${methodName.toUpperCase()}]`,

    base = {
        colorize,
        getChalk: () => chalk,
        getChalkMap: () => chalkMap,

        prelog: methodName =>
            colorize(methodName, getDisplayMethodString(methodName)),

        postlog: () => ''
    };

module.exports = base;

