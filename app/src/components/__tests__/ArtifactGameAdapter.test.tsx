import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { ArtifactGameAdapter } from '../ArtifactGameAdapter';

// Mock react-native-webview since it is a native module not available in the
// Jest/jsdom environment.  The mock exposes the onMessage prop so tests can
// simulate WebView messages without a real native bridge.
jest.mock('react-native-webview', () => {
  const React = require('react');

  const WebView = React.forwardRef(
    (
      props: { onMessage?: (event: { nativeEvent: { data: string } }) => void },
      ref: React.Ref<unknown>,
    ) => {
      // Expose a helper on the ref so tests can fire synthetic messages
      React.useImperativeHandle(ref, () => ({
        injectJavaScript: jest.fn(),
        postMessage: jest.fn(),
      }));

      return React.createElement('WebView', {
        testID: 'artifact-webview',
        ...props,
      });
    },
  );
  WebView.displayName = 'WebView';

  return { WebView };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SAMPLE_HTML = '<html><body><p>game</p></body></html>';

/** Build a synthetic WebViewMessageEvent payload. */
function makeWebViewEvent(data: unknown) {
  return { nativeEvent: { data: JSON.stringify(data) } };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ArtifactGameAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // 1. Renders correctly without optional callbacks (null/undefined case)
  // -------------------------------------------------------------------------

  describe('rendering without optional callbacks', () => {
    it('renders without crashing when only htmlContent is provided', () => {
      const { getByTestId } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} />,
      );

      // The WebView should be present in the tree
      expect(getByTestId('artifact-webview')).toBeTruthy();
    });

    it('renders a containing View when no callbacks are supplied', () => {
      const { toJSON } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} />,
      );

      // The root element should exist (View > WebView)
      expect(toJSON()).not.toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // 2. Renders correctly with a valid artifact (all props supplied)
  // -------------------------------------------------------------------------

  describe('rendering with a valid artifact and all callbacks', () => {
    it('renders the WebView with the provided htmlContent', () => {
      const onMessage = jest.fn();
      const onScoreUpdate = jest.fn();
      const onGameOver = jest.fn();
      const onNavigate = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onMessage={onMessage}
          onScoreUpdate={onScoreUpdate}
          onGameOver={onGameOver}
          onNavigate={onNavigate}
        />,
      );

      expect(getByTestId('artifact-webview')).toBeTruthy();
    });

    it('calls onMessage with the parsed ArtifactMessage for every message type', () => {
      const onMessage = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} onMessage={onMessage} />,
      );

      const webView = getByTestId('artifact-webview');
      const readyEvent = makeWebViewEvent({ type: 'ready' });
      webView.props.onMessage(readyEvent);

      expect(onMessage).toHaveBeenCalledTimes(1);
      expect(onMessage).toHaveBeenCalledWith({ type: 'ready' });
    });

    it('calls onScoreUpdate with the score number when a scoreUpdate message arrives', () => {
      const onScoreUpdate = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onScoreUpdate={onScoreUpdate}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(
        makeWebViewEvent({ type: 'scoreUpdate', payload: { score: 42 } }),
      );

      expect(onScoreUpdate).toHaveBeenCalledTimes(1);
      expect(onScoreUpdate).toHaveBeenCalledWith(42);
    });

    it('does not call onScoreUpdate when payload.score is not a number', () => {
      const onScoreUpdate = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onScoreUpdate={onScoreUpdate}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(
        makeWebViewEvent({ type: 'scoreUpdate', payload: { score: 'high' } }),
      );

      expect(onScoreUpdate).not.toHaveBeenCalled();
    });

    it('calls onGameOver with finalScore when a gameOver message arrives', () => {
      const onGameOver = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onGameOver={onGameOver}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(
        makeWebViewEvent({ type: 'gameOver', payload: { finalScore: 100 } }),
      );

      expect(onGameOver).toHaveBeenCalledTimes(1);
      expect(onGameOver).toHaveBeenCalledWith(100);
    });

    it('calls onGameOver with 0 when gameOver payload has no finalScore', () => {
      const onGameOver = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onGameOver={onGameOver}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(makeWebViewEvent({ type: 'gameOver' }));

      expect(onGameOver).toHaveBeenCalledWith(0);
    });

    it('calls onNavigate with the target string when a navigate message arrives', () => {
      const onNavigate = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onNavigate={onNavigate}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(
        makeWebViewEvent({ type: 'navigate', payload: { target: 'home' } }),
      );

      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith('home');
    });

    it('calls onNavigate with "back" when navigate payload has no target', () => {
      const onNavigate = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onNavigate={onNavigate}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(makeWebViewEvent({ type: 'navigate' }));

      expect(onNavigate).toHaveBeenCalledWith('back');
    });

    it('does not call specialised handlers for the "custom" message type', () => {
      const onScoreUpdate = jest.fn();
      const onGameOver = jest.fn();
      const onNavigate = jest.fn();
      const onMessage = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter
          htmlContent={SAMPLE_HTML}
          onMessage={onMessage}
          onScoreUpdate={onScoreUpdate}
          onGameOver={onGameOver}
          onNavigate={onNavigate}
        />,
      );

      const webView = getByTestId('artifact-webview');
      webView.props.onMessage(
        makeWebViewEvent({ type: 'custom', payload: { foo: 'bar' } }),
      );

      // onMessage is always called; the others must not be
      expect(onMessage).toHaveBeenCalledTimes(1);
      expect(onScoreUpdate).not.toHaveBeenCalled();
      expect(onGameOver).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 3. Error-handling in the message bridge (error boundary catch behaviour)
  // -------------------------------------------------------------------------

  describe('handleMessage error handling (malformed messages)', () => {
    it('does not throw when the WebView sends non-JSON data', () => {
      const onMessage = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} onMessage={onMessage} />,
      );

      const webView = getByTestId('artifact-webview');

      // Sending raw, non-JSON text must not crash the component
      expect(() => {
        webView.props.onMessage({ nativeEvent: { data: 'not json at all' } });
      }).not.toThrow();

      // The callbacks must not have been invoked
      expect(onMessage).not.toHaveBeenCalled();
    });

    it('does not throw when the WebView sends an empty string', () => {
      const { getByTestId } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} />,
      );

      const webView = getByTestId('artifact-webview');

      expect(() => {
        webView.props.onMessage({ nativeEvent: { data: '' } });
      }).not.toThrow();
    });

    it('does not throw when the WebView sends a JSON object with no type field', () => {
      const onMessage = jest.fn();

      const { getByTestId } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} onMessage={onMessage} />,
      );

      const webView = getByTestId('artifact-webview');

      // This is valid JSON but does not match ArtifactMessage — it should still
      // be forwarded to onMessage without error.
      expect(() => {
        webView.props.onMessage(
          makeWebViewEvent({ unexpectedField: 'value' }),
        );
      }).not.toThrow();

      expect(onMessage).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // 4. Web platform — renders an iframe instead of WebView
  // -------------------------------------------------------------------------

  describe('web platform rendering', () => {
    let originalOS: typeof Platform.OS;

    beforeEach(() => {
      originalOS = Platform.OS;
      // Cast required because Platform.OS is normally read-only at the type level
      (Platform as { OS: string }).OS = 'web';
    });

    afterEach(() => {
      (Platform as { OS: string }).OS = originalOS;
    });

    it('renders an iframe element on the web platform', () => {
      const { toJSON } = render(
        <ArtifactGameAdapter htmlContent={SAMPLE_HTML} />,
      );

      const tree = toJSON() as { children: Array<{ type: string }> } | null;
      expect(tree).not.toBeNull();

      // The View's first child should be an iframe, not a WebView
      const firstChild = tree?.children?.[0];
      expect(firstChild?.type).toBe('iframe');
    });
  });
});
