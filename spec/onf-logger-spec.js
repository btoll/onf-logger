/* eslint-disable no-console */
'use strict';

const color = require('chalk');
const fs = require('fs');
const stdoutLog = './stdout.log';
let logger = require('../src/index');

describe('onf-logger', () => {
    const fn = flag =>
        function () {
            fs.writeFileSync(stdoutLog, Array.from(arguments).join(' '), {
                flag: flag || 'w'
            });
        };

    const makeLogger = (flag, fns) => {
        return fns || {
            error: fn(flag),
            info: fn(flag),
            log: fn(flag),
            warn: fn(flag)
        };
    };

    afterAll(() => fs.unlinkSync(stdoutLog));

    it('should allow access to the underyling wrapped logger object', () => {
        expect(logger.__get()).toBe(console);
    });

    it('should allow access to the underyling color package', () => {
        expect(logger.getColor()).toBe(color);
    });

    describe('aliases', () => {
        it('should not create aliases by default', () => {
            logger = logger.setLogger(makeLogger());
            expect(() => logger.debug()).toThrow();
        });

        it('should create aliases if opting-in', () => {
            logger = logger.setLogger(makeLogger(), true);
            expect(() => logger.debug()).not.toThrow();
        });

        it('should accept an object of custom aliases', () => {
            logger = logger.setLogger(makeLogger(), {
                foo: 'log'
            });

            expect(() => logger.foo()).not.toThrow();
        });
    });

    describe('formatting', () => {
        it('should allow access to the formatter', () => {
            expect(logger.getFormatter()).toBeDefined();
        });

        // TODO
        describe('date', () => {
        });
    });

    describe('log level', () => {
        describe('#getLogLevel', () => {
            it('should default to ALL', () => {
                expect(logger.getLogLevel()).toBe(255);
            });
        });

        describe('#setLogLevel', () => {
            it('should allow the level to be set to a single value', () => {
                logger.setLogLevel('FATAL');
                expect(logger.getLogLevel()).toBe(16);
            });

            it('should allow the level to be set to an aggregate value', () => {
                logger.setLogLevel('INFO|WARN|DEBUG');
                expect(logger.getLogLevel()).toBe(38);
            });
        });

        describe('throttling the log level', () => {
            beforeAll(() => {
                // We want to append the logs for these tests.
                logger = logger.setLogger(makeLogger('a'), true);
                logger.disableColor();
            });

            beforeEach(() =>
                // Overwrite previous contents to test this.
                fs.writeFileSync(stdoutLog, ''),

                // Reset log level.
                logger.setLogLevel(255)
            );

            it('should log below the set log level', () => {
                logger.setLogLevel('INFO_ALL');

                logger.disableDate();

                logger.raw('derp');
                logger.log('herp');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('derp[LOG] herp');

                logger.enableDate();
            });

            it('should not log above the set log level', () => {
                logger.setLogLevel('ERRORS');

                logger.fatal('This should not be logged!');
                logger.debug('Neither should this!');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('');
            });

            it('should not log anything when off', () => {
                logger.setLogLevel('NONE');

                logger.debug('debug');
                logger.error('error');
                logger.fatal('fatal');
                logger.info('info');
                logger.log('log');
                logger.raw('raw');
                logger.warn('warn');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('');
            });
        });
    });

    describe('logging', () => {
        let myConsole;

        beforeEach(() => {
            // Make sure to reset the log level!
            logger.setLogLevel(255);

            myConsole = makeLogger();
            logger = logger.setLogger(myConsole, true);

            // Always overwrite previous contents.
            fs.writeFileSync(stdoutLog, '');
        });

        describe('colors', () => {
            beforeEach(() => logger.disableDate());
            afterEach(() => logger.enableDate());

            it('should allow colors to be disabled', () => {
                logger.disableColor();
                logger.error('foo');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('[ERROR] foo');
            });

            it('should allow colors to be enabled', () => {
                logger.enableColor();
                logger.warn('baz');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe(`${logger.getColor().yellow('[WARN]')} baz`);
            });
        });

        describe('date', () => {
            beforeEach(() => logger.disableColor());
            afterEach(() => logger.enableDate());

            it('should allow the date to be disabled', () => {
                logger.disableDate();
                logger.error('foo');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('[ERROR] foo');
            });

            it('should allow the date to be enabled', () => {
                logger.warn('baz');

                // TODO: Should be a better assertion here.
                expect(fs.readFileSync(stdoutLog, 'utf8')).not.toBe('[WARN] baz');
            });
        });

        describe('general logging', () => {
            beforeEach(() => (logger.disableColor(), logger.disableDate()));
            afterEach(() => logger.enableDate());

            it('should prepend the error message with the type', () => {
                logger.warn('foo');
                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('[WARN] foo');
            });

            it('should not prepend the error message with the type when `raw`', () => {
                logger.raw('foo');
                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('foo');
            });

            it('should pass all params through to the underlying logging implementation', () => {
                spyOn(myConsole, 'error');
                logger.error('foo', 5);

                expect(myConsole.error).toHaveBeenCalledWith('[ERROR]', 'foo', 5);
            });

            it('should throw when calling a non-existent but previously-defined function', () => {
                logger.warn('foobar');

                // Note we're setting a new logger but then we're not re-defining the `logger` var so
                // it still points to the old one! This is necessary to setup the error, it cannot
                // happen any other way!
                //
                // Also, note we're passing in an object of logger functions that doesn't include `warn`!
                logger.setLogger(makeLogger('w', {
                    error: fn(),
                    info: fn(),
                    log: fn()
                }), true);

                expect(() => logger.warn('foobar')).toThrow();
            });
        });
    });

    describe('tpl', () => {
        describe('dateTpl', () => {
            it('should default to {Y}-{m}-{d}', () => {
                expect(logger.getFormatter().getDateTpl()).toBe('{Y}-{m}-{d}');
            });

            it('should allow for it to be set', () => {
                logger.getFormatter().setDateTpl('{m}-{d}-{Y}');
                expect(logger.getFormatter().getDateTpl()).toBe('{m}-{d}-{Y}');
            });
        });

        describe('timeTpl', () => {
            it('should default to {H}:{i}:{s}.{ms}', () => {
                expect(logger.getFormatter().getTimeTpl()).toBe('{H}:{i}:{s}.{ms}');
            });

            it('should allow for it to be set', () => {
                logger.getFormatter().setTimeTpl('{H}:{i}');
                expect(logger.getFormatter().getTimeTpl()).toBe('{H}:{i}');
            });
        });
    });
});

