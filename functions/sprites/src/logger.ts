/**
 * Comprehensive Logging Utility for Cloud Functions
 * Provides structured logging with multiple severity levels
 * @module logger
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  context?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private context?: string;
  private minLevel: LogLevel;

  constructor(context?: string, minLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.minLevel = minLevel;
  }

  /**
   * Generate ISO 8601 timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Format and output log entry
   */
  private log(level: LogLevel, message: string, data?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level,
      message,
      ...(this.context && { context: this.context }),
      ...(data && { data }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    // Use appropriate console method based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(JSON.stringify(entry));
        break;
      case LogLevel.INFO:
        console.info(JSON.stringify(entry));
        break;
      case LogLevel.WARN:
        console.warn(JSON.stringify(entry));
        break;
      case LogLevel.ERROR:
        console.error(JSON.stringify(entry));
        break;
    }
  }

  /**
   * Log debug message
   * Use for detailed debugging information
   */
  debug(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info message
   * Use for general informational messages
   */
  info(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   * Use for warning conditions that should be addressed
   */
  warn(message: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   * Use for error conditions and exceptions
   */
  error(message: string, error?: Error, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  /**
   * Create a child logger with additional context
   */
  child(childContext: string): Logger {
    const newContext = this.context 
      ? `${this.context}.${childContext}` 
      : childContext;
    return new Logger(newContext, this.minLevel);
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(context?: string, minLevel?: LogLevel): Logger {
  return new Logger(context, minLevel);
}

/**
 * Default logger instance
 */
export const logger = createLogger('CloudFunction');

/**
 * Utility function to log function execution time
 */
export async function logExecutionTime<T>(
  loggerInstance: Logger,
  functionName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  loggerInstance.info(`Starting ${functionName}`);
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    loggerInstance.info(`Completed ${functionName}`, { durationMs: duration });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    loggerInstance.error(
      `Failed ${functionName}`,
      error instanceof Error ? error : new Error(String(error)),
      { durationMs: duration }
    );
    throw error;
  }
}

/**
 * Utility function to safely stringify objects for logging
 */
export function safeStringify(obj: any, maxDepth: number = 5): string {
  const seen = new WeakSet();
  
  const stringifyHelper = (value: any, depth: number): any => {
    if (depth > maxDepth) {
      return '[Max Depth Reached]';
    }
    
    if (value === null || value === undefined) {
      return value;
    }
    
    if (typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      return '[Circular Reference]';
    }
    
    seen.add(value);
    
    if (Array.isArray(value)) {
      return value.map((item) => stringifyHelper(item, depth + 1));
    }
    
    const result: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = stringifyHelper(value[key], depth + 1);
      }
    }
    
    return result;
  };
  
  try {
    return JSON.stringify(stringifyHelper(obj, 0), null, 2);
  } catch (error) {
    return `[Unable to stringify: ${error}]`;
  }
}

export default logger;
