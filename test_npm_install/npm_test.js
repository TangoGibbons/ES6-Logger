
import logLevel from 'es6-logger';
import * as logger from 'es6-logger';

logger.setLogMode(logger.logMode.CONSOLE);
logger.setGlobalLogLevel(logLevel.TRACE);

logger.logIt(logLevel.TRACE, "test");