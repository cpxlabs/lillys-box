import { Platform } from 'react-native';
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

  init(): void {
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
    } else {
      logger.warn('[ErrorService] Warning reported:', fullReport.message);
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
