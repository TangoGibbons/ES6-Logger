
// Log Levels - trace, debug, info, warn, error, fatal
import fs from 'fs';
import chalk from 'chalk';

chalk.level = 1;
const fatal = chalk.bgRed.bold;
const error = chalk.red.bold;
const warn = chalk.yellow.bold;
const info = chalk.blue;
const debug = chalk.green;
const trace = chalk.white;

const logLevel = {
    TRACE : "TRACE", 
    DEBUG : "DEBUG", 
    INFO : "INFO",
    WARN : "WARN",
    ERROR : "ERROR",
    FATAL : "FATAL"
};
export default logLevel;

export const logMode = {
    CONSOLE : "CONSOLE", 
    FILE : "FILE"
}

global.__configuredLogLevel = global.__configuredLogLevel = 0; // default to trace;
global.__outputMode = logMode.CONSOLE;
global.__fileAndPath = null;

export function setLogMode(__changeOutputMode, __changeFileWithPath = null) {
    try {
        global.__outputMode = logMode.CONSOLE;
        switch (__changeOutputMode) {
            case logMode.CONSOLE:
                global.__outputMode = logMode.CONSOLE;
                break;
            case logMode.FILE:
                global.__outputMode = logMode.FILE;
                global.__fileAndPath = __changeFileWithPath;
        }
        return global.__outputMode;
    } catch (err) {
        throw err;
    }
}

export function setLogLevel(__changeLogLevel) {
    try {
        global.__configuredLogLevel = 0; // default to trace
        switch (__changeLogLevel) {
            case logLevel.TRACE:
                global.__configuredLogLevel = 0;
                break;
            case logLevel.DEBUG:
                global.__configuredLogLevel = 1;
                break;
            case logLevel.INFO:
                global.__configuredLogLevel = 2;
                break;
            case logLevel.WARN:
                global.__configuredLogLevel = 3;
                break;
            case logLevel.ERROR:
                global.__configuredLogLevel = 4;
                break;
            case logLevel.FATAL:
                global.__configuredLogLevel = 5;
                break;
        }
    } catch (err) {
        throw err;
    }
}

//The logging function.
export function logIt(__logLevel, logMessage) {
    try {
        switch (__logLevel) {
            case logLevel.TRACE:
                if (global.__configuredLogLevel <= 0) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? trace('Trace - ' + logMessage) : 'Trace - ' + logMessage);
                }
                break;
            case logLevel.DEBUG:
                if (global.__configuredLogLevel <= 1) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? debug('Debug - ' + logMessage) : 'Debug - ' + logMessage);
                }
                break;
            case logLevel.INFO:
                if (global.__configuredLogLevel <= 2) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? info('Info - ' + logMessage) : 'Info - ' + logMessage);
                }
                break;
            case logLevel.WARN:
                if (global.__configuredLogLevel <= 3) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? warn('Warn! ' + logMessage) : 'Warn! ' + logMessage);
                }
                break;
            case logLevel.ERROR:
                if (global.__configuredLogLevel <= 4) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? error('Error!! ' + logMessage) : 'Error!! ' + logMessage);
                }
                break;
            case logLevel.FATAL:
                if (global.__configuredLogLevel <= 5) {
                    logTheMessage(global.__outputMode == logMode.CONSOLE ? fatal('Fatal!!! ' + logMessage) : 'Fatal!!! - ' + logMessage);
                }
                break;
        }
    } catch (err) {
        throw err;
    }
}

function logTheMessage(__message) {
    let dateTime = Date().toString();
    switch (global.__outputMode) {
        case logMode.CONSOLE:
            console.log(dateTime.substring(0,dateTime.lastIndexOf(":") + 3) + " " + __message);
            break;
        case logMode.FILE:
            try {
                fs.appendFileSync(global.__fileAndPath, '\n' + dateTime.substring(0,dateTime.lastIndexOf(":") + 3) + " " + __message);
            } catch (err) {
                throw err;
            }
            break;            
    }
}
