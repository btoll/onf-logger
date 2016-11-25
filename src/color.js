'use strict';

const color = require('chalk');
const colorMap = {
    debug: 'bgBlue',
    error: 'red',
    fatal: 'bgRed',
    info: 'cyan',
    log: 'green',
    success: 'green',
    warn: 'yellow'
};

module.exports = {
    color: (logMethodName, str) => color[colorMap[logMethodName]](str),
    getColor: () => color
};

