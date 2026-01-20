/**
 * Centralized logging and error handling utility
 * Provides environment-aware logging and structured error handling
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  /**
   * Log a debug message (development only)
   */
  debug(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data ? { context, data } : { context });
      this.recordLog('debug', message, context, data);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data ? { context, data } : { context });
    }
    this.recordLog('info', message, context, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data ? { context, data } : { context });
    this.recordLog('warn', message, context, data);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: string, error?: unknown): void {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
    } : error;
    
    console.error(`[ERROR] ${message}`, { context, error: errorData });
    this.recordLog('error', message, context, errorData);
  }

  /**
   * Get all recorded logs
   */
  getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  private recordLog(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(entry);
    
    // Keep logs array bounded
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }
}

export const logger = new Logger();

/**
 * Structured error class for API and application errors
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/**
 * Type-safe error handler
 */
export function handleError(error: unknown, context: string): AppError {
  if (error instanceof AppError) {
    logger.error(error.message, context, error);
    return error;
  }

  if (error instanceof Error) {
    const appError = new AppError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      context
    );
    logger.error(error.message, context, error);
    return appError;
  }

  const appError = new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500,
    context
  );
  logger.error('Unknown error', context, error);
  return appError;
}
