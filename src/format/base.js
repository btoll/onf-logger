'use strict';

const color = require('../color');

module.exports = {
    color,
    prelog: (logMethodName, isColorEnabled) => {
        const formattedName = `[${logMethodName.toUpperCase()}]`;

        return !isColorEnabled ?
            formattedName :
            color.color(logMethodName, formattedName);
    },
    postlog: () => ''
};

