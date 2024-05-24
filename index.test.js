
import fs from 'fs';
import logLevel from './index.js';
import * as logger from './index.js';

test('set the logMode', () => {
    expect(logger.setLogMode(logger.logMode.CONSOLE)).toBe(logger.logMode.CONSOLE);
    expect(logger.setLogMode(logger.logMode.FILE)).toBe(logger.logMode.FILE);
});

test('set the logLevel', () => {
    expect(logger.setLogLevel(logLevel.TRACE)).toBe(logLevel.TRACE);
    expect(logger.setLogLevel(logLevel.DEBUG)).toBe(logLevel.DEBUG);
    expect(logger.setLogLevel(logLevel.INFO)).toBe(logLevel.INFO);
    expect(logger.setLogLevel(logLevel.WARN)).toBe(logLevel.WARN);
    expect(logger.setLogLevel(logLevel.ERROR)).toBe(logLevel.ERROR);
    expect(logger.setLogLevel(logLevel.FATAL)).toBe(logLevel.FATAL);
});

test('writing to log file', () => {
    let fd = fs.readFileSync('test.txt', { encoding: 'utf8', flag: 'w+' });
    fd.close;

    logger.setLogLevel(logLevel.TRACE);
    logger.setLogMode(logger.logMode.FILE, 'test.txt');
    logger.logIt(logLevel.TRACE, 'test row 1');
    logger.logIt(logLevel.TRACE, 'test row 2');
    logger.logIt(logLevel.TRACE, 'test row 3');

    let text = fs.readFileSync('test.txt').toString();
    let lines = text.split('\n');
    let new_lines = lines.length - 1;
    
    expect(3).toBe(new_lines);
});

