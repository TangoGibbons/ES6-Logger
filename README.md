# tango-es6-logger

tango-es6-logger is a simple logger for NodeJS projects.  tango-es6-logger is built using the es6 specification, meaning it uses the es6 modules specification for importing into NodeJS modules.

## tango-es6-logger Features
1) Set the globalLogLevel to determine what log messages are generated.  Supported logging levels are:

TRACE < DEBUG < INFO < WARN < ERROR < FATAL

A log message will be generated if the globalLogLevel is greater than or equal to the messageLogLevel for a given request.  For example, if the globalLogLevel is set to WARN, log messages with a messageLogLevel of TRACE, DEBUG, or INFO will not be generated but log messages with a messageLogLevel of WARN, ERROR, or FATAL will be generated.

2) Set the logMode to output the log message to either the console log or a file.  If the logMode is set to FILE, then the file path and name must be specified.

3) Specify for each log request the log level, or messageLogLevel, for that request.  The log message will be generated as long as the messageLogLevel for a given request is greater than or equal to the globalLogLevel you set, as mentioned in bullet 1 above.



## Install
```shell
npm install tango-es6-logger
```

## Usage
tango-es6-logger has three (3) exported functions and two (2) exported enums.  These functions and enums represent the public facing interface to the tango-es6-logger and have been designed to be very simple to use.  

We will explain the enums, first.

1) logMode - The values for logMode are CONSOLE and FILE.  This enum is used when setting the manner in which you want the log messages to be generated.  When you set the logMode to CONSOLE, the log messages will be displayed in the console window.  If you specify the logMode to be FILE, the log messages will be generated in a file.  When specifying a logModel of FILE, you must also provide the path and filename of the file in which you want the log messages to be generated, see the description of the setLogMode function below.

2) logLevel - The values for logLevel are TRACE, DEBUG, INFO, WARN, ERROR, and FATAL.  This enum is used in two ways: setting the globalLogLevel that is used when determining if a specific log message should be generated and to specify the messageLogLevel for each log message request.

Now, let's visit the functions.

1) setLogMode(logMode[, filePathAndName])

- logMode is of type logMode (the enum mentioned above)
- filePathAndName is of type string and represents the file path and name of the log file in which log messages will be generated.

You call the setLogMode function to set the logMode.  The logMode is used for each log message, to determine where to generate the log message: CONSOLE for the console window and FILE for a log file.  The logMode enum is available to be used for setting the value of the first parameter.  When using a logMode of FILE, the second parameter is required, the file path and name into which the log messages will be generated.  Please note, the second parameter is not required if the specified logMode is CONSOLE.

You can change the logMode as many times as you wish by calling the setLogMode more than once.  All log message requests will use the most recent set logMode.

2) setGlobalLogLevel(logLevel)

- logLevel is of type logLevel (the enum mentioned above)

This method sets the globalLogLevel.  You can set the globalLogLevel, then change it later, but all requests to generate a log message will use the most recently set globalLogLevel.  A request to generate a specific log message must include a messageLogLevel.  The messageLogLevel is compared to the globalLogLevel to determine if a log message will be generated.

Other logger solutions use the term "filter" when referring to the realtionship between the messageLogLevel and globalLogLevel.  For tango-es6-logger, filter is not the right verb because a log entry is not generated if the messageLogLevel for a given request is less than the globalLogLevel you set.  The verb 'filter' implies all log messages are generated and possibly not shown.  However, tango-es6-logger simply does not generated a log message if the messageLogLevel is less than the globalLogLevel.

3) logIt(messageLogLevel, logMessage)

- messageLogLevel is of tpe logLevel (the enum mentioned above)
- logMessage is of type string

This method is used to request a log message be generated.  The messageLogLevel specifies the log level of the given log request and is compared to the globalLogLevel to determine if the requested log message is generated or not.  If the messageLogLevel is less than the globalLogLevel, the log message is not generated.  If, however, the messageLogLevel is greater than or equal to the globalLogLevel, then the log message is generated.

For example, if the globalLogLevel is set to WARN, then log requests with messageLogLevels of TRACE, DEBUG, or INFO are not generated and log requests with messageLogLevels of WARN, ERROR, or FATAL are geneated.  However, if the globalLogLevel is set to TRACE, then all log requests are generated because TRACE is the lowest possible logLevel.


## Additional Detail
1) Typically, the logMode and globalLogLevel are set before calling the logIt method.  This way, the logIt method will generate a log message exactly in accordance to your wishes.  However, the logMode does default to logMode.CONSOLE and the globalLogLevel does default to logLevel.TRACE.

2) Because the logLevel enum will be used quite often, this enum is the default export.  So, you can import the logLevel as following:

```
import logLevel from 'tango-es6-logger';
```

Then use it in your code as follows:

```
logLevel.WARN
```

as opposed to:

```
logger.logLevel.WARN
```

Of course, you can import the logLevel as you wish, and, therefore, refer to it in your code as you wish.

3) The other enum and all methods are individually exported, requiring the following means of importing and using them:

```
import * as logger from 'tango-es6-logger';

- To set the globalLogLevel to TRACE: logger.setLogLevel(logLevel.TRACE);
- To set the logMode to CONSOLE: logger.setLogMode(logger.logMode.CONSOLE);
- To set the logMode to FILE: logger.setLogMode(logger.logMode.FILE, 'test.txt');
- To write a log message with a messageLogLevel of DEBUG: logger.logIt(logLevel.DEBUG, 'log message');
```

4) Each log message is proceeded with the current date/time.

5) For messages written to the console, text and background colors are provided for ease of viewing.


## Examples
```
import logLevel from 'tango-es6-logger';
import * as logger from 'tango-es6-logger';

logger.setLogLevel(logLevel.TRACE);
logger.setLogMode(logger.logMode.FILE, 'myLogFile.txt');
logIt(logLevel.WARN, 'This message will appear in the myLogFile.txt file.');

logger.setLogLevel(logLevel.ERROR);
logger.setLogMode(logger.logMode.CONSOLE);
logIt(logLevel.TRACE, 'This message will not appear because the messageLogLevel is less than the globalLogLevel.');

logger.setLogLevel(logLevel.DEBUG);
logger.setLogMode(logger.logMode.CONSOLE);
logIt(logLevel.DEBUG, 'This message will display in the console because the messageLogLevel is greater than or equal to the globalLogLevel');
```