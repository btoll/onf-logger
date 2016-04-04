/* eslint-disable no-console, one-var */
'use strict';

const logger = {},
    // TODO
    preprocess = () => '',
    postprocess = () => '',
    aliases = {
        debug: 'info',
        fatal: 'error'
    };

let format = require('./format/base'),
    wrapped = console || {},
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

// Allow access to the underlying wrapped logger object.
logger.__get = () => wrapped;
logger.disable = () => disabled = true;
logger.enable = () => disabled = false;
// TODO
logger.logLevel = () => {};
logger.setFormat = f => format = require(`./format/${f}`);
logger.wrap = target => wrapped = target;

module.exports = logger;

