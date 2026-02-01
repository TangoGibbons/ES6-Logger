/*
 * Developed by Tom Gibbons for public use in accordance to the 
 * rights of use agreement set forth by the npm Open-Source Terms
 *
 * @author: tgibbons
*/

/*
 * Tests for Logger Module
 *
*/

import fs from 'fs';
import logLevel from './tango-es6-logger.js';
import * as logger from './tango-es6-logger.js';
import { jest } from '@jest/globals';


beforeEach(() => {
    logger.setLogMode(logger.logMode.CONSOLE);
    logger.setGlobalLogLevel(logLevel.TRACE);
});


// Test setting the logMode
test('set the logMode', () => {
    expect(logger.setLogMode(logger.logMode.CONSOLE)).toBe(logger.logMode.CONSOLE);
    expect(logger.setLogMode(logger.logMode.FILE, 'test.txt')).toBe(logger.logMode.FILE);
    expect(logger.setLogMode('UNSUPPORTED')).toBe(logger.logMode.CONSOLE);
});


// Test setting the logLevel
test('set the logLevel', () => {
    expect(logger.setGlobalLogLevel(logLevel.TRACE)).toBe(logLevel.TRACE);
    expect(logger.setGlobalLogLevel(logLevel.DEBUG)).toBe(logLevel.DEBUG);
    expect(logger.setGlobalLogLevel(logLevel.INFO)).toBe(logLevel.INFO);
    expect(logger.setGlobalLogLevel(logLevel.WARN)).toBe(logLevel.WARN);
    expect(logger.setGlobalLogLevel(logLevel.ERROR)).toBe(logLevel.ERROR);
    expect(logger.setGlobalLogLevel(logLevel.FATAL)).toBe(logLevel.FATAL);
    expect(logger.setGlobalLogLevel('UNSUPPORTED')).toBe(logLevel.TRACE);
});


// Test permutations of logLevel and log level
test('should show on the console', () => {
    logger.setLogMode(logger.logMode.CONSOLE);

    // Test all logLevels on a logLevel setting of trace
    logger.setGlobalLogLevel(logLevel.TRACE);
    expect(logger.logIt(logLevel.TRACE, 'trace on trace')).toBe(true);
    expect(logger.logIt(logLevel.DEBUG, 'debug on trace')).toBe(true);
    expect(logger.logIt(logLevel.INFO, 'info on trace')).toBe(true);
    expect(logger.logIt(logLevel.WARN, 'warn on trace')).toBe(true);
    expect(logger.logIt(logLevel.ERROR, 'error on trace')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on trace')).toBe(true);
    
    // Test all logLevels on a logLevel setting of debug
    logger.setGlobalLogLevel(logLevel.DEBUG);
    expect(logger.logIt(logLevel.TRACE, 'trace on debug')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on debug')).toBe(true);
    expect(logger.logIt(logLevel.INFO, 'info on debug')).toBe(true);
    expect(logger.logIt(logLevel.WARN, 'warn on debug')).toBe(true);
    expect(logger.logIt(logLevel.ERROR, 'error on debug')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on debug')).toBe(true);
    
    // Test all logLevels on a logLevel setting of info
    logger.setGlobalLogLevel(logLevel.INFO);
    expect(logger.logIt(logLevel.TRACE, 'trace on info')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on info')).toBe(false);
    expect(logger.logIt(logLevel.INFO, 'info on info')).toBe(true);
    expect(logger.logIt(logLevel.WARN, 'warn on info')).toBe(true);
    expect(logger.logIt(logLevel.ERROR, 'error on info')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on info')).toBe(true);

    // Test all logLevels on a logLevel setting of warn
    logger.setGlobalLogLevel(logLevel.WARN);
    expect(logger.logIt(logLevel.TRACE, 'trace on warn')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on warn')).toBe(false);
    expect(logger.logIt(logLevel.INFO, 'info on warn')).toBe(false);
    expect(logger.logIt(logLevel.WARN, 'warn on warn')).toBe(true);
    expect(logger.logIt(logLevel.ERROR, 'error on warn')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on warn')).toBe(true);

    // Test all logLevels on a logLevel setting of error
    logger.setGlobalLogLevel(logLevel.ERROR);
    expect(logger.logIt(logLevel.TRACE, 'trace on error')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on error')).toBe(false);
    expect(logger.logIt(logLevel.INFO, 'info on error')).toBe(false);
    expect(logger.logIt(logLevel.WARN, 'warn on error')).toBe(false);
    expect(logger.logIt(logLevel.ERROR, 'error on error')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on error')).toBe(true);

    // Test all logLevels on a logLevel setting of fatal
    logger.setGlobalLogLevel(logLevel.FATAL);
    expect(logger.logIt(logLevel.TRACE, 'trace on fatal')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on fatal')).toBe(false);
    expect(logger.logIt(logLevel.INFO, 'info on fatal')).toBe(false);
    expect(logger.logIt(logLevel.WARN, 'warn on fatal')).toBe(false);
    expect(logger.logIt(logLevel.ERROR, 'error on fatal')).toBe(false);
    expect(logger.logIt(logLevel.FATAL, 'fatal on fatal')).toBe(true);    
});


// Test logging to file
test('writing to log file', async () => {
    fs.writeFileSync('test.txt', '');

    logger.setGlobalLogLevel(logLevel.TRACE);
    logger.setLogMode(logger.logMode.FILE, 'test.txt');

    logger.logIt(logLevel.TRACE, 'test row 1');
    logger.logIt(logLevel.TRACE, 'test row 2');
    logger.logIt(logLevel.TRACE, 'test row 3');

    await new Promise(resolve => setTimeout(resolve, 10));

    const text = fs.readFileSync('test.txt', 'utf8');
    const lines = text.trim().split('\n');

    expect(lines.length).toBe(3);
});


// verify log levels are routed to the correct standard output
test('warn and error write to stderr', async () => {
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

    logger.setLogMode(logger.logMode.CONSOLE);
    logger.setGlobalLogLevel(logLevel.TRACE);

    logger.logIt(logLevel.WARN, 'warn message');
    logger.logIt(logLevel.ERROR, 'error message');

    await new Promise(resolve => setImmediate(resolve));

    expect(stderrSpy).toHaveBeenCalled();
    expect(stdoutSpy).not.toHaveBeenCalled();

    stderrSpy.mockRestore();
    stdoutSpy.mockRestore();
});


// test to see error handling when a logfile name is missing
test('file mode without path throws', () => {
    expect(() => {
        logger.setLogMode(logger.logMode.FILE);
    }).toThrow('FILE logMode requires a file path');
});


// test to determine if the message is logged based upon the global log level and message log level
test('logIt returns false when suppressed', () => {
    logger.setGlobalLogLevel(logLevel.ERROR);

    expect(logger.logIt(logLevel.INFO, 'info')).toBe(false);
    expect(logger.logIt(logLevel.ERROR, 'error')).toBe(true);
});