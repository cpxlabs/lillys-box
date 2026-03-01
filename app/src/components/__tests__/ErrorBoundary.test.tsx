import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock ErrorService
jest.mock('../../services/ErrorService', () => ({
  __esModule: true,
  default: {
    reportJSError: jest.fn(),
  },
}));

// Suppress expected console.error from React error boundary
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Error: Uncaught') ||
        args[0].includes('The above error occurred'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Child content</Text>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(getByText('Child content')).toBeTruthy();
  });

  it('renders default error UI when a child throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(getByText('Oops! Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('reports the error via ErrorService', () => {
    const ErrorService = require('../../services/ErrorService').default;

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(ErrorService.reportJSError).toHaveBeenCalledTimes(1);
    expect(ErrorService.reportJSError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.any(String),
    );
  });

  it('renders custom fallback when provided', () => {
    const fallback = (error: Error, _errorInfo: any, retry: () => void) => (
      <Text testID="custom-fallback">{`Custom: ${error.message}`}</Text>
    );

    const { getByText } = render(
      <ErrorBoundary fallback={fallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(getByText('Custom: Test error')).toBeTruthy();
  });

  it('recovers after pressing Try Again', () => {
    let shouldThrow = true;

    function ConditionalThrow() {
      if (shouldThrow) {
        throw new Error('Recoverable error');
      }
      return <Text>Recovered</Text>;
    }

    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(getByText('Oops! Something went wrong')).toBeTruthy();

    // Fix the error before retrying
    shouldThrow = false;
    fireEvent.press(getByText('Try Again'));

    expect(getByText('Recovered')).toBeTruthy();
    expect(queryByText('Oops! Something went wrong')).toBeNull();
  });
});
