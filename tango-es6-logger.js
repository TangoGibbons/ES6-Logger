
/*
 * Developed by Tom Gibbons for public use in accordance to the 
 * rights of use agreement set forth by the npm Open-Source Terms
 *
 * @author: tgibbons
*/

/*
 * This is a self-contained module that relies on a two dependencies.
 * An npm package challed chalk is used to provide services for displaying
 * colorized output to the console log.  The JavaScript fs library is used
 * for managing output to a log file when the selected output mode is file.
 *
 * This is a simple logger module that provides five logging levels 
 * to be output to two output modes.  
 * 
 * The supported logging levels are: trace, debug, info, warn, error, fatal
 * These levels are heirarchical, meaning fatal a log message with a log level
 * of fatal will output if the output loglevel is set to trace, but trace will
 * not output if the output loglevel is set to fatal, and so on.
 * 
 * The supported output modes are: console and file.  Console will output to the
 * console log and file will append to a file on the hosting servers file system.
 * The log file name is supplied by the calling program.
 * 
*/

// Required dependent libraries
import fs from 'fs';
import chalk from 'chalk';


// Setting chalk values - See the chalk npm package documentation for details.
chalk.level = 1;
const fatal = chalk.bgRed.bold;
const error = chalk.red.bold;
const warn = chalk.yellow.bold;
const info = chalk.blue;
const debug = chalk.green;
const trace = chalk.white;


// An enum for the supported log levels.  This enum is the default export so that the calling
// software can simply refer to the log level as logLevel versus the more verbose logger.logLevel
// PUBLIC ENUM
const logLevel = {
    TRACE : 'TRACE', 
    DEBUG : 'DEBUG', 
    INFO : 'INFO',
    WARN : 'WARN',
    ERROR : 'ERROR',
    FATAL : 'FATAL'
};
export default logLevel;


// An enum for the supported log modes.  
// PUBLIC ENUM
export const logMode = {
    CONSOLE : 'CONSOLE', 
    FILE : 'FILE'
}


// Setting up global values used to control the behavior of the logger.  
global.__globalLogLevel = 0; // default to trace;
global.__logMode = logMode.CONSOLE; // default to console.
global.__fileAndPath = null; // If the default logMode is console, there is no need for a default log file.


// A function for setting the logMode.  
// The global.__logMode value is changed so that the changed value is effective for all subsequent calls.
// PUBLIC METHOD
export function setLogMode(__changeLogMode, __changeFileWithPath = null) {
    try {
        switch (__changeLogMode) {
            case logMode.CONSOLE:
                global.__logMode = logMode.CONSOLE;
                break;
            case logMode.FILE:
                global.__logMode = logMode.FILE;
                global.__fileAndPath = __changeFileWithPath;
                break;
            default: // In case the wrong __logMode was passed into this function
                global.__logMode = logMode.CONSOLE;
                logIt(logLevel.WARN, 'The logMode is not set to either CONSOLE or FILE - defaulting to CONSOLE.');
                break;                
        }
        return global.__logMode; // Returning mainly for testing purposes
    } catch (err) {
        throw err;
    }
}


// A function for setting the desired logLevel.  
// The global.__globalLogLevel value is changed so that the changed value is effective for all subsequent calls.
// PUBLIC METHOD
export function setGlobalLogLevel(__changeLogLevel) {
    try {
        let logLevelSet;
        switch (__changeLogLevel) {
            case logLevel.TRACE:
                global.__globalLogLevel = 0;
                logLevelSet = logLevel.TRACE;
                break;
            case logLevel.DEBUG:
                global.__globalLogLevel = 1;
                logLevelSet = logLevel.DEBUG;
                break;
            case logLevel.INFO:
                global.__globalLogLevel = 2;
                logLevelSet = logLevel.INFO;
                break;
            case logLevel.WARN:
                global.__globalLogLevel = 3;
                logLevelSet = logLevel.WARN;
                break;
            case logLevel.ERROR:
                global.__globalLogLevel = 4;
                logLevelSet = logLevel.ERROR;
                break;
            case logLevel.FATAL:
                global.__globalLogLevel = 5;
                logLevelSet = logLevel.FATAL;
                break;
            default: // default to trace
                global.__globalLogLevel = 0;
                logLevelSet = logLevel.TRACE;
                logIt(logLevel.WARN, 'Trying to set logLevel to invalid value - defaulting to TRACE.');
                break;
        }
        return logLevelSet; // Returning mainly for testing purposes
    } catch (err) {
        throw err;
    }
}


// The logging function.
// PUBLIC METHOD
export function logIt(__logLevel, logMessage) {
    try {
        validateGlobalLogLevelValue();  // Validate the global.__configLogLevel wasn't changed outside of this module.
        let logged;
        switch (__logLevel) {
            case logLevel.TRACE:
                logged = false;
                if (global.__globalLogLevel <= 0) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? trace('Trace - ' + logMessage) : 'Trace - ' + logMessage);
                    logged = true;
                }
                break;
            case logLevel.DEBUG:
                logged = false;
                if (global.__globalLogLevel <= 1) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? debug('Debug - ' + logMessage) : 'Debug - ' + logMessage);
                    logged = true;
                }
                break;
            case logLevel.INFO:
                logged = false;
                if (global.__globalLogLevel <= 2) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? info('Info - ' + logMessage) : 'Info - ' + logMessage);
                    logged = true;
                }
                break;
            case logLevel.WARN:
                logged = false;
                if (global.__globalLogLevel <= 3) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? warn('Warn! ' + logMessage) : 'Warn! ' + logMessage);
                    logged = true;
                }
                break;
            case logLevel.ERROR:
                logged = false;
                if (global.__globalLogLevel <= 4) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? error('Error!! ' + logMessage) : 'Error!! ' + logMessage);
                    logged = true;
                }
                break;
            case logLevel.FATAL:
                logged = false;
                if (global.__globalLogLevel <= 5) {
                    logTheMessage(global.__logMode == logMode.CONSOLE ? fatal('Fatal!!! ' + logMessage) : 'Fatal!!! - ' + logMessage);
                    logged = true;
                }
                break;
            default:
                // A default codepath if the passed in logLevel does not match a supported level (the user is warned).
                logTheMessage(global.__logMode == logMode.CONSOLE ? trace('Trace - ' + logMessage) : 'Trace - ' + logMessage);
                logMessage = 'Invalid logLevel was used when calling logIt. Defaulted to TRACE.'
                logTheMessage(global.__logMode == logMode.CONSOLE ? warn('Warn - ' + logMessage) : 'Warn - ' + logMessage);
                logged = true;
                break;                
        }
        return logged  // Returning mainly for testing purposes
    } catch (err) {
        throw err;
    }
}


// Validate the global.__configLogLevel is of an expected type and value range.
// Throw an error if something is unexpected versus changing the global variable to a default because
// changing the global variable to a default value will probably result in unexpected behavior in the 
// calling program.
// PRIVATE METHOD
function validateGlobalLogLevelValue() {
    if ((typeof global.__globalLogLevel) != 'number') {
        throw 'global.__globalLogLevel has been changed outside of the logger module.';
    } else if (global.__globalLogLevel <0 || global.__globalLogLevel > 5) {
        throw 'global.__globalLogLevel has been changed outside of the logger module.';
    }
}


// Abstracted method of performing the actual logging.
// PRIVATE METHOD
function logTheMessage(__message) {
    let dateTime = Date().toString();
    switch (global.__logMode) {
        case logMode.CONSOLE:
            console.log(dateTime.substring(0,dateTime.lastIndexOf(':') + 3) + ' ' + __message);
            break;
        case logMode.FILE:
            try {
                fs.appendFileSync(global.__fileAndPath, '\n' + dateTime.substring(0,dateTime.lastIndexOf(':') + 3) + ' ' + __message);
            } catch (err) {
                throw err;
            }
            break;    
        default:
            // A default codepath if the global.__logMode value is not a supported value, 
            // meaning it was changed outside this module (the user is warned).
            let warningMessage = warn('Warn - global.__logMode was changed outside the logger module.  Defaulting output to console.');
            console.log(dateTime.substring(0,dateTime.lastIndexOf(':') + 3) + ' ' + warningMessage);
            console.log(dateTime.substring(0,dateTime.lastIndexOf(':') + 3) + ' ' + __message);
            break;  
    }
}