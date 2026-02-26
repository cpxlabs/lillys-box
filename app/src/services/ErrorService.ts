import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { logger } from '../utils/logger';

export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  platform: string;
  appVersion?: string;
  userId?: string;
  extra?: Record<string, unknown>;
}

export type ErrorLevel = 'error' | 'warning' | 'info';

class ErrorService {
  private errorListeners: Array<(report: ErrorReport) => void> = [];
  private maxStoredErrors = 10;
  private errorBuffer: ErrorReport[] = [];
  private isSentryInitialized = false;

  /**
   * Initialize Sentry for error tracking
   * @param dsn - Sentry DSN from project settings (can also use SENTRY_DSN env var)
   */
  init(dsn?: string): void {
    if (this.isSentryInitialized) return;

    const sentryDsn = dsn || process.env.EXPO_PUBLIC_SENTRY_DSN;
    
    if (sentryDsn && Platform.OS !== 'web') {
      Sentry.init({
        dsn: sentryDsn,
        environment: __DEV__ ? 'development' : 'production',
        enabled: !__DEV__,
        tracesSampleRate: 1.0,
      });
      this.isSentryInitialized = true;
      logger.log('[ErrorService] Sentry initialized');
    } else if (Platform.OS === 'web') {
      logger.log('[ErrorService] Sentry skipped on web platform');
    } else {
      logger.warn('[ErrorService] Sentry DSN not provided - error tracking disabled');
    }

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.onerror = this.handleGlobalError.bind(this);
        window.onunhandledrejection = this.handleUnhandledRejection.bind(this);
      }
    } else {
      global.onerror = this.handleGlobalError.bind(this);
    }
    logger.log('[ErrorService] Initialized');
  }

  private handleGlobalError(
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): boolean {
    const report: ErrorReport = {
      message: typeof message === 'string' ? message : String(message),
      stack: error?.stack,
      timestamp: Date.now(),
      platform: Platform.OS,
      extra: {
        source,
        lineno,
        colno,
      },
    };

    this.reportError(report, 'error');
    return false;
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const report: ErrorReport = {
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: Date.now(),
      platform: Platform.OS,
    };

    this.reportError(report, 'error');
  }

  reportError(report: ErrorReport, level: ErrorLevel = 'error'): void {
    const fullReport: ErrorReport = {
      ...report,
      timestamp: report.timestamp || Date.now(),
      platform: report.platform || Platform.OS,
    };

    this.errorBuffer.push(fullReport);
    if (this.errorBuffer.length > this.maxStoredErrors) {
      this.errorBuffer.shift();
    }

    this.errorListeners.forEach(listener => {
      try {
        listener(fullReport);
      } catch (listenerError) {
        console.error('[ErrorService] Listener error:', listenerError);
      }
    });

    if (level === 'error') {
      logger.error('[ErrorService] Error reported:', fullReport.message, fullReport.stack);
      if (this.isSentryInitialized) {
        Sentry.captureException(new Error(fullReport.message), {
          extra: fullReport.extra,
        });
      }
    } else {
      logger.warn('[ErrorService] Warning reported:', fullReport.message);
      if (this.isSentryInitialized) {
        Sentry.captureMessage(fullReport.message, 'warning');
      }
    }
  }

  reportJSError(error: Error, componentStack?: string | null): void {
    this.reportError(
      {
        message: error.message,
        stack: error.stack,
        componentStack: componentStack || undefined,
        timestamp: Date.now(),
        platform: Platform.OS,
      },
      'error'
    );
  }

  addListener(listener: (report: ErrorReport) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  getRecentErrors(): ErrorReport[] {
    return [...this.errorBuffer];
  }

  clearErrors(): void {
    this.errorBuffer = [];
  }
}

export default new ErrorService();
