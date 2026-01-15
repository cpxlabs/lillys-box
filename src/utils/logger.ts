/**
 * Environment-aware logging utility
 *
 * Provides controlled logging that respects development vs production environments.
 * In production, only errors are logged. In development, all log levels are available.
 */

const isDev = __DEV__;

/**
 * Centralized logger with environment-aware output
 */
export const logger = {
  /**
   * Log general information (dev only)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (dev only)
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged, even in production)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log debug information (dev only)
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log information about component lifecycle or state changes (dev only)
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
};
