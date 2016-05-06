'use strict';

const chalk = require('../chalk');

module.exports = {
    chalk,
    prelog: logMethodName => chalk.color(logMethodName, `[${logMethodName.toUpperCase()}]`),
    postlog: () => ''
};

