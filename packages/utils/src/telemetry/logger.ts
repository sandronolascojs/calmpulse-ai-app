import pino, { DestinationStream, LoggerOptions, Logger as PinoLogger } from 'pino';

/**
 * Log levels supported by the logger.
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Contextual information for each log entry.
 */
export interface LogContext {
  userId?: string;
  path?: string;
  statusCode?: number;
  error?: string | Error;
  requestId?: string;
  ip?: string;
  [key: string]: unknown;
}

/**
 * Options for initializing the Logger.
 */
export interface LoggerInitOptions {
  serviceName: string;
  level?: LogLevel;
  redactFields?: string[];
  logToFile?: boolean;
  logFilePath?: string;
  globalContext?: LogContext;
  isProd?: boolean;
}

export class Logger {
  private readonly logger: PinoLogger;
  private readonly serviceName: string;
  private globalContext: LogContext = {};

  constructor({
    serviceName,
    level = 'info',
    redactFields = [],
    logToFile = false,
    logFilePath = 'logs/app.log',
    globalContext = {},
    isProd,
  }: LoggerInitOptions) {
    this.serviceName = serviceName;
    this.globalContext = globalContext;

    // Redact sensitive fields
    const redact =
      redactFields.length > 0 ? { paths: redactFields, censor: '[REDACTED]' } : undefined;

    // Determine transport based on environment (constructor param takes precedence)
    const prod = typeof isProd === 'boolean' ? isProd : process.env.APP_ENV === 'production';
    let transport: LoggerOptions['transport'] | undefined = undefined;
    let destination: DestinationStream | undefined = undefined;

    if (logToFile) {
      // Log to file (rotating not included, but can be added with pino/file or pino/file-rotator)
      destination = pino.destination({
        dest: logFilePath,
        sync: false,
      });
    } else if (!prod) {
      // Pretty print in development
      transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    }

    this.logger = pino(
      {
        level,
        redact,
        base: { serviceName },
        transport,
      } as LoggerOptions,
      destination,
    );
  }

  /**
   * Set or update global context (e.g., requestId, userId) for all logs.
   */
  setGlobalContext(context: LogContext): void {
    this.globalContext = { ...this.globalContext, ...context };
  }

  /**
   * Log an info message with optional context.
   */
  info(message: string, context?: LogContext): void {
    this.logger.info(this.formatContext(context), message);
  }

  /**
   * Log a warning message with optional context.
   */
  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatContext(context), message);
  }

  /**
   * Log an error message with optional context.
   */
  error(message: string, context?: LogContext): void {
    this.logger.error(this.formatContext(context), message);
  }

  /**
   * Log a debug message with optional context.
   */
  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatContext(context), message);
  }

  /**
   * Formatea el contexto para logging, asegurando que no se permita un campo 'context' anidado y que los logs sean planos.
   */
  private formatContext(context?: LogContext): Record<string, unknown> {
    const merged: Record<string, unknown> = {
      ...this.globalContext,
      ...context,
      serviceName: this.serviceName,
      timestamp: new Date().toISOString(),
    };
    // Remove the 'context' field if it exists
    if ('context' in merged) {
      delete merged['context'];
    }
    // Only attempt to remove 'serviceName' and 'timestamp' if context is defined and contains those keys
    if (context && ('serviceName' in context || 'timestamp' in context)) {
      delete merged['serviceName'];
      delete merged['timestamp'];
    }
    if (merged.error instanceof Error) {
      merged.error = merged.error.stack || merged.error.message;
    }
    return merged;
  }
}

/**
 * Example usage:
 *
 * // Singleton logger for a service
 * export const logger = new Logger({
 *   serviceName: 'my-service',
 *   level: process.env.LOG_LEVEL as LogLevel || 'info',
 *   redactFields: ['userId', 'password', 'token'],
 *   logToFile: process.env.APP_ENV === 'production',
 *   logFilePath: 'logs/my-service.log',
 *   isProd: process.env.APP_ENV === 'production',
 * });
 *
 * // Set global context (e.g., per request)
 * logger.setGlobalContext({ requestId: 'abc-123', userId: 'user-1' });
 *
 * // Log with additional context
 * logger.info('User login', { path: '/login', statusCode: 200 });
 * logger.error('Failed to fetch data', { error: new Error('DB error'), path: '/data', statusCode: 500 });
 */
