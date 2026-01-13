# tango-es6-logger

A lightweight, dependency-free logger for **Node.js** projects built using **ES6 modules**.

`tango-es6-logger` provides a minimal, explicit logging API with configurable log levels and output modes (console or file). It is intentionally simple, predictable, and easy to reason about.

---

## ✨ Features

- **Six log levels**  
  `TRACE < DEBUG < INFO < WARN < ERROR < FATAL`

- **Global log level control**  
  Only messages at or above the configured level are generated.

- **Multiple output modes**
  - Console
  - File

- **ES6 module support**
  - Clean `import` syntax
  - No CommonJS boilerplate

- **Zero dependencies**

- **Colorized console output** for improved readability

---

## 📦 Installation

```bash
npm install tango-es6-logger
```

---

## 🚀 Quick Start

```js
import logLevel from 'tango-es6-logger';
import * as logger from 'tango-es6-logger';

logger.setGlobalLogLevel(logLevel.DEBUG);
logger.setLogMode(logger.logMode.CONSOLE);

logger.logIt(logLevel.INFO, 'Application started');
```

---

## 🧪 Examples

### Example 1 — Log to a File

```js
logger.setGlobalLogLevel(logLevel.TRACE);
logger.setLogMode(logger.logMode.FILE, 'myLogFile.txt');

logger.logIt(logLevel.WARN, 'This message will be written to myLogFile.txt');
```

### Example 2 — Log Suppression via Global Log Level

```js
logger.setGlobalLogLevel(logLevel.ERROR);
logger.setLogMode(logger.logMode.CONSOLE);

logger.logIt(
  logLevel.TRACE,
  'This message will not be generated because TRACE < ERROR'
);
```

### Example 3 — Console Logging

```js
logger.setGlobalLogLevel(logLevel.DEBUG);
logger.setLogMode(logger.logMode.CONSOLE);

logger.logIt(
  logLevel.DEBUG,
  'This message will appear because DEBUG >= DEBUG'
);
```

---

## 🧠 Logging Model

A log message is generated **only if**:

```
messageLogLevel >= globalLogLevel
```

This is **not filtering**.

Messages below the global log level are **never created**, not merely hidden.

---

## 📚 Public API

`tango-es6-logger` exposes:

- **2 enums**
- **3 functions**

### Enums

#### `logLevel` *(default export)*

```js
TRACE | DEBUG | INFO | WARN | ERROR | FATAL
```

Used to:
- Set the global log level
- Specify the level of individual log messages

---

#### `logMode`

```js
CONSOLE | FILE
```

Used to define where log messages are written.

---

### Functions

#### `setLogMode(logMode[, filePathAndName])`

```js
logger.setLogMode(logger.logMode.CONSOLE);
logger.setLogMode(logger.logMode.FILE, 'logs/app.log');
```

- Sets where log messages are written
- When using `FILE`, a file path **must** be provided
- Can be called multiple times — the most recent call wins

---

#### `setGlobalLogLevel(logLevel)`

```js
logger.setGlobalLogLevel(logLevel.WARN);
```

- Defines the minimum log level that will be generated
- Can be changed at runtime

---

#### `logIt(messageLogLevel, message)`

```js
logger.logIt(logLevel.INFO, 'Processing request');
```

- Requests generation of a log entry
- The message is generated only if `messageLogLevel >= globalLogLevel`

---

## 📌 Defaults

If not explicitly set:

- `logMode` defaults to `CONSOLE`
- `globalLogLevel` defaults to `TRACE`

---

## 📥 Importing Notes

Because `logLevel` is used frequently, it is exported as the **default export**:

```js
import logLevel from 'tango-es6-logger';

logLevel.WARN;
```

All other exports are named:

```js
import * as logger from 'tango-es6-logger';

logger.setGlobalLogLevel(logLevel.TRACE);
logger.setLogMode(logger.logMode.CONSOLE);
logger.logIt(logLevel.DEBUG, 'Debug message');
```

---

## 🕒 Log Output Format

- Each log entry is prefixed with the **current date and time**
- Console output includes **foreground and background colors** for clarity

---

## ⚠️ Global Variables (Internal)

`tango-es6-logger` uses the following global variables internally:

- `global.__globalLogLevel`
- `global.__logMode`
- `global.__fileAndPath`

**Do not use or modify these variables directly.**

They are:
- Managed exclusively via the public API
- Validated on access
- Designed to throw errors if corrupted

This design choice favors **explicit failure** over silent misbehavior.

