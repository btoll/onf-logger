'use strict';

const chalk = require('chalk');
const chalkMap = {
    debug: 'bgBlue',
    error: 'red',
    fatal: 'bgRed',
    info: 'cyan',
    log: 'green',
    success: 'green',
    warn: 'yellow'
};

module.exports = {
    color: (logMethodName, str) => chalk[chalkMap[logMethodName]](str),
    getChalk: () => chalk
};

