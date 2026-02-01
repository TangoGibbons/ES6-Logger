
/*
 * Developed by Tom Gibbons for public use in accordance to the 
 * rights of use agreement set forth by the npm Open-Source Terms
 *
 * @author: tgibbons
*/

/*
 * This is a self-contained module that relies on a two dependencies.
 * An npm package called chalk is used to provide services for displaying
 * colorized output to the console log.  The JavaScript fs library is used
 * for managing output to a log file when the selected output mode is file.
 *
 * This is a simple logger module that provides six logging levels 
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


// Setting up values used to control the behavior of the logger.  
let globalLogLevel = 0; // default to trace;
let currentLogMode = logMode.CONSOLE; // default to console.
let fileAndPath    = null; // If the default logMode is console, there is no need for a default log file.
let fileStream     = null; // stream for non-blocking log output to a file;

// A function for setting the logMode.  
// The current logMode value is changed so that the change is effective
// PUBLIC METHOD
export function setLogMode(changeLogMode, changeFileWithPath = null) {
    switch (changeLogMode) {
        case logMode.CONSOLE:
            if (fileStream) {
                fileStream.end();
                fileStream = null;
            }
            currentLogMode = logMode.CONSOLE;
            fileAndPath = null;
            break;
        case logMode.FILE:
            if (!changeFileWithPath) {
                throw new Error('FILE logMode requires a file path');
            }

            if (fileStream) {
                fileStream.end();
            }

            fileAndPath = changeFileWithPath;
            fileStream = fs.createWriteStream(fileAndPath, { flags: 'a' });
            currentLogMode = logMode.FILE;
            break;
        default: // In case the wrong logMode was passed into this function
            currentLogMode = logMode.CONSOLE;
            logIt(logLevel.WARN, 'The logMode is not set to either CONSOLE or FILE - defaulting to CONSOLE.');
            break;                
    }
    return currentLogMode; // Returning mainly for testing purposes
}


// A function for setting the desired logLevel.  
// The global.__globalLogLevel value is changed so that the changed value is effective for all subsequent calls.
// PUBLIC METHOD
export function setGlobalLogLevel(__changeLogLevel) {
    let returnLevelVariable = __changeLogLevel;
    switch (__changeLogLevel) {
        case logLevel.TRACE:
            globalLogLevel = 0;
            break;
        case logLevel.DEBUG:
            globalLogLevel = 1;
            break;
        case logLevel.INFO:
            globalLogLevel = 2;
            break;
        case logLevel.WARN:
            globalLogLevel = 3;
            break;
        case logLevel.ERROR:
            globalLogLevel = 4;
            break;
        case logLevel.FATAL:
            globalLogLevel = 5;
            break;
        default: // default to trace
            globalLogLevel = 0;
            returnLevelVariable = logLevel.TRACE;
            logIt(logLevel.WARN, 'Trying to set logLevel to invalid value - defaulting to TRACE.');
            break;
    }
    return returnLevelVariable; // Returning mainly for testing purposes
}


// The logging function.
// PUBLIC METHOD
export function logIt(messageLogLevel, logMessage) {
    
    let logged = false;
    switch (messageLogLevel) {
        case logLevel.TRACE:
            if (globalLogLevel <= 0) {
                logTheMessage(trace('Trace - ' + logMessage), false);
                logged = true;
            }
            break;
        case logLevel.DEBUG:
            if (globalLogLevel <= 1) {
                logTheMessage(debug('Debug - ' + logMessage), false);
                logged = true;
            }
            break;
        case logLevel.INFO:
            if (globalLogLevel <= 2) {
                logTheMessage(info('Info - ' + logMessage), false);
                logged = true;
            }
            break;
        case logLevel.WARN:
            if (globalLogLevel <= 3) {
                logTheMessage(warn('Warn! ' + logMessage), true);
                logged = true;
            }
            break;
        case logLevel.ERROR:
            if (globalLogLevel <= 4) {
                logTheMessage(error('Error!! ' + logMessage), true);
                logged = true;
            }
            break;
        case logLevel.FATAL:
            if (globalLogLevel <= 5) {
                logTheMessage(fatal('Fatal!!! ' + logMessage), true);
                logged = true;
            }
            break;
        default:
            // A default codepath if the passed in logLevel does not match a supported level (the user is warned).
            logTheMessage(trace('Trace - ' + logMessage), false);
            logMessage = 'Invalid logLevel was used when calling logIt. Defaulted to TRACE.';
            logTheMessage(warn('Warn - Invalid logLevel. Defaulted to TRACE.'), true);
            logged = true;
            break;                
    }
    return logged  // Returning mainly for testing purposes
}


// Abstracted method of performing the actual logging.
// PRIVATE METHOD
function logTheMessage(message, isErrorStream) {
    const timestamp = new Date().toISOString();
    const line = `${timestamp} ${message}`;

    switch (currentLogMode) {
        case logMode.CONSOLE:
            const stream = isErrorStream ? process.stderr : process.stdout;
            stream.write(line + '\n');
            break;
        case logMode.FILE:
            if (fileStream) {
                fileStream.write(line + '\n');
            }
            break;    
        default:
            // A default codepath if the currentLogMode does not match a supported mode (the user is warned).
            process.stderr.write(`${timestamp} WARN - Invalid logMode. Defaulting to CONSOLE.\n`);
            process.stdout.write(line + '\n');
            break;  
    }
}