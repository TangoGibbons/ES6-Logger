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
import logLevel from './logger.js';
import * as logger from './logger.js';


// Test setting the logMode
test('set the logMode', () => {
    expect(logger.setLogMode(logger.logMode.CONSOLE)).toBe(logger.logMode.CONSOLE);
    expect(logger.setLogMode(logger.logMode.FILE)).toBe(logger.logMode.FILE);
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


// Changing the global.__configuredLogLevel outside the logger module
test('should show on the console', () => {
    logger.setLogMode(logger.logMode.CONSOLE);

    // Test all logLevels on a logLevel setting of trace
    logger.setGlobalLogLevel(logLevel.TRACE);
    global.__configuredLogLevel = 4;
    expect(logger.logIt(logLevel.TRACE, 'trace on trace')).toBe(false);
    expect(logger.logIt(logLevel.DEBUG, 'debug on trace')).toBe(false);
    expect(logger.logIt(logLevel.INFO, 'info on trace')).toBe(false);
    expect(logger.logIt(logLevel.WARN, 'warn on trace')).toBe(false);
    expect(logger.logIt(logLevel.ERROR, 'error on trace')).toBe(true);
    expect(logger.logIt(logLevel.FATAL, 'fatal on trace')).toBe(true);
});


// Changing the global.__logMode outside the logger module
test('should show on the console with warning', () => {
    logger.setLogMode(logger.logMode.FILE, 'test.txt');

    logger.setGlobalLogLevel(logLevel.TRACE);
    global.__logMode = 'UNSUPPORTED';
    expect(logger.logIt(logLevel.TRACE, 'testing unsupported logMode set outside the logger module')).toBe(true);
});


// Test logging to file
test('writing to log file', () => {
    let fd = fs.readFileSync('test.txt', { encoding: 'utf8', flag: 'w+' });
    fd.close;

    logger.setGlobalLogLevel(logLevel.TRACE);
    logger.setLogMode(logger.logMode.FILE, 'test.txt');
    logger.logIt(logLevel.TRACE, 'test row 1');
    logger.logIt(logLevel.TRACE, 'test row 2');
    logger.logIt(logLevel.TRACE, 'test row 3');

    let text = fs.readFileSync('test.txt').toString();
    let lines = text.split('\n');
    let new_lines = lines.length - 1;
    expect(3).toBe(new_lines);
});


// Test changing the global.__fileAndPath outside the logger module to a valid value
test('change the global.__fileAndPath to a valid value', () => {
    let fd1 = fs.readFileSync('test.txt', { encoding: 'utf8', flag: 'w+' });
    fd1.close;
    let fd2 = fs.readFileSync('changeTestName.txt', { encoding: 'utf8', flag: 'w+' });
    fd2.close;

    logger.setGlobalLogLevel(logLevel.TRACE);
    logger.setLogMode(logger.logMode.FILE, 'test.txt');

    global.__fileAndPath = 'changeTestName.txt';
    logger.logIt(logLevel.TRACE, 'test row 1');
    logger.logIt(logLevel.TRACE, 'test row 2');
    logger.logIt(logLevel.TRACE, 'test row 3');

    let text = fs.readFileSync('changeTestName.txt').toString();
    let lines = text.split('\n');
    let new_lines = lines.length - 1;
    expect(3).toBe(new_lines);

    text = fs.readFileSync('test.txt').toString();
    lines = text.split('\n');
    new_lines = lines.length - 1;
    expect(0).toBe(new_lines);
});


// Test errors generated if the global.__configuredLogLevel is changed external to the logger module
test('external change to logLevel, should show on console with warning', () => {
    expect(logger.setLogMode(logger.logMode.CONSOLE)).toBe(logger.logMode.CONSOLE);
    expect(logger.setGlobalLogLevel(logLevel.FATAL)).toBe(logLevel.FATAL);

    global.__configuredLogLevel = 10;
    expect(()=>{
        logger.logIt(logLevel.FATAL, 'An error should be thrown because global.__configuredLogLevel is not between 0 and 5 inclusively');
    }).toThrow();

    global.__configuredLogLevel = "failure";
    expect(()=>{
        logger.logIt(logLevel.FATAL, 'An error should be thrown because global.__configuredLogLevel is not of type number');
    }).toThrow();
});


// Test error generated if bad file name is used
test('external change to logLevel, should show on console with warning', () => {
    expect(logger.setLogMode(logger.logMode.FILE, null)).toBe(logger.logMode.FILE);

    expect(()=>{
        logger.logIt(logLevel.FATAL, 'An error should be thrown because of a bad file name');
    }).toThrow();

    expect(logger.setLogMode(logger.logMode.FILE, 'test.txt')).toBe(logger.logMode.FILE);
    global.__fileAndPath = null;
    expect(()=>{
        logger.logIt(logLevel.FATAL, 'An error should be thrown because the global.__fileAndPath value was changed to a bad file name');
    }).toThrow();
});