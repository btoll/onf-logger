# onf-logger

`onf-logger` wraps any native or non-native logging implementation and provides hooks and aliases for complete customization.

The default behavior is to wrap the `console` object, which is the native logger in most platforms. The can be changed via the `logger.setLogger()` API.

[![Build Status](https://travis-ci.org/btoll/onf-logger.svg?branch=master)](https://travis-ci.org/btoll/onf-logger)
[![Coverage Status](https://coveralls.io/repos/github/btoll/onf-logger/badge.svg?branch=master)](https://coveralls.io/github/btoll/onf-logger?branch=master)

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

