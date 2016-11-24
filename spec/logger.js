/* eslint-disable no-console */
'use strict';

// const cons = require('console');
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
        let writeStream;
        let capturedConsole;

        beforeEach(() => {
            writeStream = fs.createWriteStream('./stdout.log', { flags: 'w' });
            capturedConsole = new cons.Console(writeStream);
            logger.wrap(capturedConsole);
            logger.error('foo');
        });

        afterEach(() => {
            writeStream = capturedConsole = null;
        });

        it('should prepend the error message with the type', () => {
//            logger.error('foo');

//            expect(fs.readFileSync('./stdout.log', 'utf8')).toBe('[ERROR] yobe');
            console.log(fs.statSync('./stdout.log'));
        });
    });
    */
});

