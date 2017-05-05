# onf-logger

[![Build Status](https://travis-ci.org/btoll/onf-logger.svg?branch=master)](https://travis-ci.org/btoll/onf-logger)
[![Coverage Status](https://coveralls.io/repos/github/btoll/onf-logger/badge.svg?branch=master)](https://coveralls.io/github/btoll/onf-logger?branch=master)

`onf-logger` wraps any native or non-native logging implementation and provides hooks and aliases for complete customization.

The default behavior is to wrap the `console` object, which is the native logger in most platforms. This can be changed via the `logger.setLogger()` API.

By wrapping each function, `onf-logger` allows for pre- and postprocessing and pre- and postlogging.

## Customizing the logging

It is very easy to define or extend a custom object to handle logging and processing according to one's needs.  The object needs to have access to the following functions, either by defining them directly on the object or via delegation:

- postprocess
- preprocess
- prelog
- postlog

Have a [look at the source][1], specifically the `wrap` function, to see the order in which they are called, it is very straight-forward.

It may be simpler to have the object delegate to the provided [`base` object][2] as the [`date` formatter][3] does, and simply override what is needed in the custom formatter object.

By default, the `date` formatter is used and is set at runtime.  To change this, simply pass the custom formatter to the `setLogger` API.

## Installation

`npm i onf-logger`

## Examples

```
logger.error('Derp!');

logger.info('Help!');

logger.success('Hurray!');

// Disable the date formatter.
logger.disableDate();
logger.info('Oh noes, what day is it?');

// Disable coloring.
logger.disableColor();
logger.success('Hello, world!');

// Re-enable both.
logger.enableDate();
logger.enableColor();

// Only log errors.
logger.setLogLevel('WARN|ERROR|FATAL'); // Same as logger.setLogLevel('ERRORS_ALL')

// Reset to log everything.
logger.setLogLevel('ALL'); // Same as logger.setLogLevel(255)
```

## License

[GPLv3](COPYING)

## Author

Benjamin Toll

[1]: /src/index.js
[2]: /src/format/base.js
[3]: /src/format/date.js

