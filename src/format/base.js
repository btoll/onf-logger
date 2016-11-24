'use strict';

const chalk = require('../chalk');

module.exports = {
    chalk,
    prelog: (logMethodName, isColorEnabled) => {
        const formattedName = `[${logMethodName.toUpperCase()}]`;

        return !isColorEnabled ?
            formattedName :
            chalk.color(logMethodName, formattedName);
    },
    postlog: () => ''
};

