/**
 * Converts a Claude AI Artifact (.tsx source code) into a self-contained
 * HTML document that can be rendered in a WebView.
 *
 * The generated HTML includes:
 * - React 18 + ReactDOM from CDN
 * - Tailwind CSS (many Claude Artifacts use it)
 * - A postMessage bridge so the artifact can communicate with React Native
 * - Viewport meta tag for proper mobile scaling
 *
 * The artifact code is compiled at runtime via Babel Standalone so JSX works
 * directly without a build step.
 */

/**
 * Bridge script injected into every artifact HTML document.
 * Provides `window.RNBridge` for artifact → React Native communication.
 *
 * Artifacts can call:
 *   window.RNBridge.sendScore(score)
 *   window.RNBridge.gameOver(finalScore)
 *   window.RNBridge.navigate('back')
 *   window.RNBridge.send({ type: 'custom', payload: {...} })
 */
const BRIDGE_SCRIPT = `
<script>
  window.RNBridge = {
    send: function(message) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      } else if (window.parent !== window) {
        window.parent.postMessage(JSON.stringify(message), '*');
      }
    },
    sendScore: function(score) {
      this.send({ type: 'scoreUpdate', payload: { score: score } });
    },
    gameOver: function(finalScore) {
      this.send({ type: 'gameOver', payload: { finalScore: finalScore } });
    },
    navigate: function(target) {
      this.send({ type: 'navigate', payload: { target: target || 'back' } });
    }
  };

  // Signal that the artifact is ready
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      window.RNBridge.send({ type: 'ready' });
    }, 100);
  });
</script>
`;

/**
 * Strips TypeScript / ES module syntax from artifact source code so it
 * can run in a plain <script type="text/babel"> block.
 *
 * Handles:
 * - import statements (React is available globally via CDN)
 * - export default / export const statements
 * - TypeScript type annotations in common patterns
 */
export function stripModuleSyntax(source: string): string {
  let code = source;

  // Remove import statements (React/ReactDOM are global via CDN)
  code = code.replace(/^import\s+.*?(?:from\s+['"].*?['"])?;?\s*$/gm, '');

  // Remove "export default" but keep the declaration
  code = code.replace(/^export\s+default\s+/gm, '');

  // Remove "export" keyword from named exports
  code = code.replace(/^export\s+(?=(?:const|let|var|function|class|interface|type)\s)/gm, '');

  // Remove TypeScript interface/type declarations (standalone blocks)
  code = code.replace(/^(?:interface|type)\s+\w+(?:<[^>]*>)?\s*=?\s*\{[^}]*\};?\s*$/gm, '');
  code = code.replace(/^type\s+\w+(?:<[^>]*>)?\s*=\s*[^;]+;\s*$/gm, '');

  // Remove TypeScript type annotations from function parameters: (x: Type)
  // This is intentionally conservative to avoid breaking code
  code = code.replace(/:\s*React\.FC(?:<[^>]*>)?/g, '');

  return code.trim();
}

/**
 * Detects the main component name exported from the artifact source.
 * Looks for patterns like:
 *   - export default function GameName
 *   - export default GameName
 *   - const GameName = () =>
 *   - function GameName()
 */
export function detectComponentName(source: string): string {
  // "export default function ComponentName"
  const defaultFnMatch = source.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultFnMatch) return defaultFnMatch[1];

  // "export default ComponentName" (identifier reference)
  const defaultIdMatch = source.match(/export\s+default\s+(\w+)\s*;/);
  if (defaultIdMatch) return defaultIdMatch[1];

  // Last "const ComponentName = " with arrow function or React.FC
  const constMatches = [...source.matchAll(/(?:export\s+)?const\s+(\w+)\s*(?::\s*\w+(?:<[^>]*>)?\s*)?=\s*(?:\([^)]*\)\s*=>|\(\s*\)\s*=>|function)/g)];
  if (constMatches.length > 0) {
    // Prefer the last one (often the main component is defined last)
    return constMatches[constMatches.length - 1][1];
  }

  // "function ComponentName" (standalone)
  const fnMatches = [...source.matchAll(/^function\s+(\w+)/gm)];
  if (fnMatches.length > 0) {
    return fnMatches[fnMatches.length - 1][1];
  }

  return 'App';
}

/**
 * Wraps artifact source code in a complete HTML document ready for WebView rendering.
 *
 * @param artifactSource - Raw .tsx source code from a Claude Artifact
 * @param options - Optional configuration
 * @returns Complete HTML string
 */
export function buildArtifactHtml(
  artifactSource: string,
  options?: {
    /** Override the detected component name */
    componentName?: string;
    /** Include Tailwind CSS (default: true) */
    includeTailwind?: boolean;
    /** Additional CSS to inject */
    extraCss?: string;
    /** Additional scripts to inject (before artifact code) */
    extraScripts?: string;
  },
): string {
  const {
    componentName = detectComponentName(artifactSource),
    includeTailwind = true,
    extraCss = '',
    extraScripts = '',
  } = options ?? {};

  const strippedCode = stripModuleSyntax(artifactSource);

  const tailwindTag = includeTailwind
    ? '<script src="https://cdn.tailwindcss.com"></script>'
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Game</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  ${tailwindTag}
  ${BRIDGE_SCRIPT}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    ${extraCss}
  </style>
  ${extraScripts}
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useRef, useMemo, useReducer, useContext, createContext } = React;

    ${strippedCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;
}
