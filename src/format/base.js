'use strict';

const chalk = require('../lib/chalk');

module.exports = {
    chalk,
    prelog: logMethodName => chalk.color(logMethodName, `[${logMethodName.toUpperCase()}]`),
    postlog: () => ''
};

