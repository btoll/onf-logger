'use strict';

const chalk = require('chalk'),
    chalkMap = {
        debug: 'cyan',
        error: 'red',
        fatal: 'bgRed',
        info: 'blue',
        log: 'green',
        warn: 'yellow'
    },

    base = {
        colorize: (methodName, str) => chalk[chalkMap[methodName]](str),
        getChalk: () => chalk,
        getChalkMap: () => chalkMap,

        prelog: methodName =>
            base.colorize(methodName, `[${methodName.toUpperCase()}]`),

        postlog: () => ''
    };

module.exports = base;

