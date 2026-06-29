const fs = require("fs");
const path = require("path");

// Check if running on Vercel
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;

let logFile = null;

// Create logs folder only when NOT on Vercel
if (!isVercel) {
  const logDir = path.join(__dirname, "../../logs");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  logFile = path.join(logDir, "app.log");
}

/**
 * Log levels
 */
const levels = {
  error: "ERROR",
  warn: "WARN",
  info: "INFO",
  debug: "DEBUG",
};

/**
 * Format log message
 */
const formatLog = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

/**
 * Write log to console and file
 */
const writeLog = (level, message) => {
  const formattedLog = formatLog(level, message);

  // Always log to console
  console.log(formattedLog);

  // Write to file only when not on Vercel
  if (!isVercel && logFile) {
    try {
      fs.appendFileSync(logFile, `${formattedLog}\n`);
    } catch (err) {
      console.error("Error writing to log file:", err);
    }
  }
};

module.exports = {
  error: (message) => writeLog(levels.error, message),
  warn: (message) => writeLog(levels.warn, message),
  info: (message) => writeLog(levels.info, message),
  debug: (message) => writeLog(levels.debug, message),
};