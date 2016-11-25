/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const stdoutLog = './stdout.log';

describe('logger', () => {
    let logger = require('../src/index');

    const makeLogger = flag => {
        const fn = function () {
            fs.writeFileSync(stdoutLog, Array.from(arguments).join(' '), {
                flag: flag || 'w'
            });
        };

        return {
            error: fn,
            info: fn,
            log: fn,
            warn: fn
        };
    };

    afterAll(() => fs.unlinkSync(stdoutLog));

    it('should allow access to the underyling wrapped logger object', () => {
        expect(logger.__get()).toBe(console);
    });

    describe('TODO: aliases', () => {
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
                const myConsole = makeLogger('a');

                logger = logger.setLogger(myConsole);
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

                logger.raw('derp');
                logger.log('herp');

                expect(fs.readFileSync(stdoutLog, 'utf8')).toBe('derp[LOG] herp');
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

        beforeAll(() => {
            // Make sure to reset the log level!
            logger.setLogLevel(255);
            myConsole = makeLogger();
            logger = logger.setLogger(myConsole);
            logger.disableColor();
        });

        beforeEach(() =>
            // Overwrite previous contents to test this.
            fs.writeFileSync(stdoutLog, '')
        );

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
    });
});

