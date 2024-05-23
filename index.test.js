
import logLevel from './index.js';
import * as logger from './index.js';

test('set the outputMode', () => {
    expect(logger.setLogMode(logger.logMode.CONSOLE)).toBe(logger.logMode.CONSOLE);
});