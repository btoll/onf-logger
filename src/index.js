'use strict';

let format = require('./format/base');

// Internal Field Separator.
const IFS = '|';

const logLevels = {
    RAW: 1,
    LOG: 1,
    INFO: 2,
    WARN: 4,
    ERROR: 8,
    FATAL: 16,
    DEBUG: 32,
    //
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
let logger = {};
let isColorEnabled = true;

// Allow access to the underlying wrapped logger object.
const __get = () =>
    wrapped;

const checkLogLevel = level =>
    logLevel & logLevels[level];

const disableColor = () =>
    isColorEnabled = false;

const enableColor = () =>
    isColorEnabled = true;

const getLogLevel = () =>
    logLevel;

const normalizeMethodName = methodName =>
    aliases[methodName] || methodName;

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
const setLogLevel = level =>
    logLevel = typeof level !== 'number' ?
        level.indexOf(IFS) > -1 ?
            // First, strip all whitespace.
            level.replace(/\s/g, '').split(IFS).reduce((acc, curr) => {
                acc += logLevels[curr];
                return acc;
            }, 0) :
            logLevels[level] :
        level;

const setLogger = target => {
    // Create a new object and its delegate every time a new logger is set.
    logger = Object.setPrototypeOf({}, proto);

    // Reference the target so the #wrap closure can call functions on the underlying object.
    wrapped = target;

    for (const methodName of Object.keys(target)) {
        logger[methodName] = wrap(methodName);
    }

    for (const alias of Object.keys(aliases)) {
        logger[alias] = wrap(alias);
    }
};

const wrap = methodName =>
    function () {
        const name = normalizeMethodName(methodName);

        if (!checkLogLevel(name.toUpperCase())) {
            return;
        }

        const fn = wrapped[name];

        if (!fn) {
            throw new Error('Function does not exist on this logger!');
        }

        preprocess(methodName);

        if (methodName === 'raw') {
            fn.apply(wrapped, arguments);
        } else {
            // Check first if it's an alias so an actual underlying implementation is called!
            fn.apply(wrapped, [format.prelog(methodName, isColorEnabled)]
                .concat(Array.from(arguments))
                .concat([format.postlog(methodName)]));
        }

        postprocess(methodName);
    };

const proto = {
    __get,
    disableColor,
    enableColor,
    getLogLevel,
    setLogLevel,
    setLogger
};

let wrapped = {};

// Defaults to the global console.
setLogger(console);

// TODO: Allow a format to be set at runtime?
// const __setFormat = f =>
//     format = logger.format = require(`./format/${f}`);

module.exports = Object.setPrototypeOf(logger, proto);

