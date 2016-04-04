'use strict';

const chalk = require('chalk'),
    chalkMap = {
        debug: 'cyan',
        error: 'red',
        fatal: 'bgRed',
        info: 'blue',
        log: 'green',
        success: 'green',
        warn: 'yellow'
    };

module.exports = {
    color: (logMethodName, str) => chalk[chalkMap[logMethodName]](str),
    getChalk: () => chalk
};

