/* eslint-disable no-console, no-unused-vars, one-var */
'use strict';

const format = require('./format/date'),
    logger = {},
    // TODO
    preprocess = methodName => '',
    postprocess = methodName => '',
    aliases = {
        debug: 'info',
        fatal: 'error'
    };

// Set some sensible defaults.
let wrapped = console || {},
    disabled = false;

function invoke(methodName) {
    return function () {
        if (disabled) {
            return;
        }

        preprocess(methodName);

        // Check first if it's an alias so an actual underlying implementation is called!
        wrapped[ aliases[methodName] || methodName ].apply(wrapped, [ format.prelog(methodName) ]
            .concat(Array.from(arguments))
            .concat([ format.postlog(methodName) ]));

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
logger.wrap = target => wrapped = target;

module.exports = logger;

