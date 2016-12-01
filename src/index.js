// TODO: Throw error when unrecognized log level is given to #setLogLevel.
'use strict';

let format = require('./format/base');

// Internal Field Separator.
const IFS = '|';

const logLevels = {
    NONE: 0,
    RAW: 1,
    LOG: 1,
    INFO: 2,
    SUCCESS: 2,
    WARN: 4,
    ERROR: 8,
    FATAL: 16,
    DEBUG: 32,
    //
    INFO_ALL: 3, // (RAW && LOG) + (INFO && SUCCESS)
    ERRORS: 12, // WARN + ERROR
    ERRORS_ALL: 28, // WARN + ERROR + FATAL
    ALL: 255
};

// TODO
const preprocess = () => '';
const postprocess = () => '';

const defaultAliases = {
    debug: 'info',
    fatal: 'error',
    raw: 'log',
    success: 'log'
};

let aliases = null;
// Default to logging everything.
let logLevel = 255;
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

// Allow access to the underlying color package.
const getColor = () =>
    format.getColor();

const getLogLevel = () =>
    logLevel;

const normalizeMethodName = methodName =>
    (aliases && aliases[methodName]) || methodName;

/**
 * @param {Number/String} level
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
            level.replace(/\s/g, '').split(IFS).reduce((acc, curr) => (
                acc += logLevels[curr], acc
            ), 0) :
            logLevels[level] :
        level;

/**
 * @param {Object} target
 * @param {Boolean/Object} useAliases
 *
 * Must opt-in to use aliases.
 *      `true` to use default aliases.
 *      Else pass an object of aliases.
 */
const setLogger = (target, useAliases) => {
    // Create a new object and its delegate every time a new logger is set.
    logger = Object.setPrototypeOf({}, proto);

    // Reference the target so the #wrap closure can call functions on the underlying object.
    wrapped = target;

    for (const methodName of Object.keys(target)) {
        logger[methodName] = wrap(methodName);
    }

    if (useAliases) {
        // Check if `useAliases` is an object of custom aliases.
        aliases = (useAliases !== true) ?
            useAliases :
            defaultAliases;

        for (const alias of Object.keys(aliases)) {
            logger[alias] = wrap(alias);
        }
    }

    return logger;
};

const wrap = methodName =>
    function () {
        if (!checkLogLevel(methodName.toUpperCase())) {
            return;
        }

        const fn = wrapped[normalizeMethodName(methodName)];

        if (!fn) {
            throw new Error('Function does not exist on this logger!');
        }

        preprocess(methodName);

        if (methodName === 'raw') {
            fn.apply(wrapped, arguments);
        } else {
            // Check first if it's an alias so an actual underlying implementation is called!
            const pre = format.prelog(methodName, isColorEnabled);
            const post = format.postlog(methodName);

            // By testing for truthiness, we can avoid situations where there is an empty string
            // returned by either the `prelog` or `postlog` functions which would result in an
            // empty string element being add to the concatenated array.
            fn.apply(wrapped,
                (pre ? [pre] : [])
                .concat(Array.from(arguments))
                .concat(post ? [post] : [])
            );
        }

        postprocess(methodName);
    };

const proto = {
    __get,
    disableColor,
    enableColor,
    getColor,
    getLogLevel,
    setLogLevel,
    setLogger
};

let wrapped = {};

// Defaults to the global console (opt-in for aliases).
setLogger(console, true);

// TODO: Allow a format to be set at runtime?
// const __setFormat = f =>
//     format = logger.format = require(`./format/${f}`);

module.exports = Object.setPrototypeOf(logger, proto);

