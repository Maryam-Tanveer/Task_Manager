const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

let logFile;
if (!isVercel) {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  logFile = path.join(logsDir, 'app.log');
}

/**
 * Log levels
 */
const levels = {
  error: 'ERROR',
  warn: 'WARN',
  info: 'INFO',
  debug: 'DEBUG',
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @returns {string} Formatted log message
 */
const formatLog = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

/**
 * Write log to file and console
 * @param {string} level - Log level
 * @param {string} message - Log message
 */
const writeLog = (level, message) => {
  const formattedLog = formatLog(level, message);

  // Console output
  console.log(formattedLog);

  // File output (skip on Vercel read-only filesystem)
  if (!isVercel && logFile) {
    try {
      fs.appendFileSync(logFile, `${formattedLog}\n`);
    } catch (err) {
      console.error('Error writing to log file:', err);
    }
  }
};

module.exports = {
  error: (message) => writeLog(levels.error, message),
  warn: (message) => writeLog(levels.warn, message),
  info: (message) => writeLog(levels.info, message),
  debug: (message) => writeLog(levels.debug, message),
};
