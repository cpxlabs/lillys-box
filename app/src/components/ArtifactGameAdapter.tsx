import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

/**
 * Message types sent from the artifact WebView to React Native.
 *
 * - scoreUpdate: The artifact reports a new score
 * - gameOver:    The artifact signals the game has ended
 * - navigate:    The artifact requests navigation (e.g. "back")
 * - ready:       The artifact has finished loading
 * - custom:      Arbitrary payload for game-specific communication
 */
export interface ArtifactMessage {
  type: 'scoreUpdate' | 'gameOver' | 'navigate' | 'ready' | 'custom';
  payload?: Record<string, unknown>;
}

interface ArtifactGameAdapterProps {
  /** Complete HTML string containing the artifact game */
  htmlContent: string;
  /** Called when the artifact sends a message to React Native */
  onMessage?: (message: ArtifactMessage) => void;
  /** Called when the game reports a score update */
  onScoreUpdate?: (score: number) => void;
  /** Called when the game signals game-over */
  onGameOver?: (finalScore: number) => void;
  /** Called when the artifact requests navigation (e.g. "back") */
  onNavigate?: (target: string) => void;
}

/**
 * Renders a Claude AI Artifact (.tsx) inside a WebView.
 *
 * The artifact is compiled to a self-contained HTML document that includes
 * React and ReactDOM from CDN, plus an optional Tailwind CSS build.
 * Communication between the artifact and React Native happens via
 * postMessage / onMessage bridge.
 *
 * Usage:
 * ```tsx
 * <ArtifactGameAdapter
 *   htmlContent={myGameHtml}
 *   onScoreUpdate={(score) => updateBestScore(score)}
 *   onGameOver={(finalScore) => showGameOverOverlay(finalScore)}
 *   onNavigate={(target) => { if (target === 'back') navigation.goBack(); }}
 * />
 * ```
 */
export const ArtifactGameAdapter: React.FC<ArtifactGameAdapterProps> = ({
  htmlContent,
  onMessage,
  onScoreUpdate,
  onGameOver,
  onNavigate,
}) => {
  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message: ArtifactMessage = JSON.parse(event.nativeEvent.data);

        onMessage?.(message);

        switch (message.type) {
          case 'scoreUpdate':
            if (typeof message.payload?.score === 'number') {
              onScoreUpdate?.(message.payload.score as number);
            }
            break;
          case 'gameOver':
            onGameOver?.((message.payload?.finalScore as number) ?? 0);
            break;
          case 'navigate':
            onNavigate?.((message.payload?.target as string) ?? 'back');
            break;
        }
      } catch {
        // Ignore malformed messages
      }
    },
    [onMessage, onScoreUpdate, onGameOver, onNavigate],
  );

  // On web, listen for postMessage events from the iframe so that the
  // RNBridge in the artifact HTML can communicate back to React Native.
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleIframeMessage = (event: MessageEvent) => {
      try {
        const message: ArtifactMessage =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (!message || !message.type) return;

        onMessage?.(message);

        switch (message.type) {
          case 'scoreUpdate':
            if (typeof message.payload?.score === 'number') {
              onScoreUpdate?.(message.payload.score as number);
            }
            break;
          case 'gameOver':
            onGameOver?.((message.payload?.finalScore as number) ?? 0);
            break;
          case 'navigate':
            onNavigate?.((message.payload?.target as string) ?? 'back');
            break;
        }
      } catch {
        // Ignore malformed messages
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [onMessage, onScoreUpdate, onGameOver, onNavigate]);

  // On web platform, render artifact in an iframe instead
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          srcDoc={htmlContent}
          style={{ flex: 1, border: 'none', width: '100%', height: '100%' } as never}
          sandbox="allow-scripts allow-same-origin"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        originWhitelist={['*']}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
