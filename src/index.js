'use strict';

let format = require('./format/base');

// Internal Field Separator.
const IFS = '|';

const logLevels = {
    RAW: 1,
    INFO: 2,
    WARN: 4,
    ERROR: 8,
    FATAL: 16,
    DEBUG: 32,
    //
    LOG: 1,
    INFO_ALL: 3, // (RAW && LOG) + INFO
    ERRORS: 12, // WARN + ERROR
    ERRORS_ALL: 28, // WARN + ERROR + FATAL
    ALL: 31 // (RAW && LOG) + INFO + WARN + ERROR + FATAL
};

// TODO
const preprocess = () => '';
const postprocess = () => '';

const aliases = {
    debug: 'info',
    fatal: 'error',
    raw: 'log',
    success: 'log'
};

// Default to logging all info and all errors except FATAL.
let logLevel = logLevels.INFO_ALL + logLevels.ERRORS;
let wrapped = console || {};

const checkLogLevel = level =>
    logLevel & logLevels[level];

const invoke = methodName =>
    function () {
        if (!checkLogLevel(methodName.toUpperCase())) {
            return;
        }

        preprocess(methodName);

        // TODO: Better way?
        if (methodName === 'raw') {
            wrapped[aliases[methodName]].apply(wrapped, arguments);
        } else {
            // Check first if it's an alias so an actual underlying implementation is called!
            wrapped[aliases[methodName] || methodName].apply(wrapped, [format.prelog(methodName)]
                .concat(Array.from(arguments))
                .concat([format.postlog(methodName)]));
        }

        postprocess(methodName);
    };

const logger = {};

for (const methodName of Object.keys(wrapped)) {
    logger[methodName] = invoke(methodName);
}

for (const alias of Object.keys(aliases)) {
    logger[alias] = invoke(alias);
}

/**
 * level === Number or a String.
 *
 * For those who know what they're doing, they can simply pass the bit value as a Number.
 *
 *      logger.setLogLevel(14);
 *
 * Else, it supports passing a String of one or more log level values delimited by the IFS:
 *
 *      logger.setLogLevel('ALL');
 *      logger.setLogLevel('ERRORS|INFO_ALL|DEBUG');
 *
 * The .reduce will simply add up the bit values.
 */
logger.setLogLevel = level =>
    logLevel = typeof level !== 'number' ?
        level.indexOf(IFS) > -1 ?
            level.split(IFS).reduce((acc, curr) => {
                acc += logLevels[curr];
                return acc;
            }, 0) :
            logLevels[level] :
        level;

logger.format = format;
logger.setFormat = f =>
    format = logger.format = require(`./format/${f}`);
logger.wrap = target => wrapped = target;

// Allow access to the underlying wrapped logger object.
logger.__get = () => wrapped;

module.exports = logger;

