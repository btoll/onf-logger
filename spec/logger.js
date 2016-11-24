/* eslint-disable no-console */
'use strict';

// const fs = require('fs');

describe('logger', () => {
    let logger = require('../src/index');

    afterEach(() => logger.setLogLevel('INFO_ALL|ERRORS'));

    it('should allow access to the underyling wrapped logger object', () => {
        expect(logger.__get()).toBe(console);
    });

    describe('log level', () => {
        describe('#getLogLevel', () => {
            it('should default to the aggregate of INFO_ALL and ERRORS', () => {
                expect(logger.getLogLevel()).toBe(15);
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
    });

    /*
    fdescribe('logging', () => {
//        let writeStream;
//        let capturedConsole;

        const fn = (...args) =>
            fs.writeFileSync('./stdout.log', args.join(' '));

        const myConsole = {
            error: fn,
            warn: fn
        };


        beforeEach(() => {
            logger.setLogger(myConsole);
            logger.disableColor();
        });

        it('should prepend the error message with the type', () => {
            logger.warn('unlucky');
//            console.log(process.cwd());
            expect(fs.readFileSync('./stdout.log', 'utf8')).toBe('[WARN] unlucky');
        });
    });
    */
});

