#!/usr/bin/env node

/**
 * Game Creation Script
 *
 * Interactive CLI tool that scaffolds a new game from a Claude AI Artifact (.tsx file).
 *
 * Usage:
 *   node scripts/create-game.js
 *   node scripts/create-game.js --artifact path/to/artifact.tsx
 *
 * What it does:
 *   1. Prompts for game metadata (id, name, description, emoji, category)
 *   2. Reads a Claude Artifact .tsx file
 *   3. Generates: Navigator, Context, HomeScreen, GameScreen
 *   4. Updates: App.tsx, navigation types, locale files
 *   5. The game immediately appears in the game selection screen
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ask(rl, question, defaultValue) {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-|-$/g, '');
}

/**
 * Strips TypeScript / ES module syntax from artifact source code.
 * Mirror of src/utils/artifactHtml.ts stripModuleSyntax (JS version for Node).
 */
function stripModuleSyntax(source) {
  let code = source;
  code = code.replace(/^import\s+.*?(?:from\s+['"].*?['"])?;?\s*$/gm, '');
  code = code.replace(/^export\s+default\s+/gm, '');
  code = code.replace(/^export\s+(?=(?:const|let|var|function|class|interface|type)\s)/gm, '');
  code = code.replace(/^(?:interface|type)\s+\w+(?:<[^>]*>)?\s*=?\s*\{[^}]*\};?\s*$/gm, '');
  code = code.replace(/^type\s+\w+(?:<[^>]*>)?\s*=\s*[^;]+;\s*$/gm, '');
  code = code.replace(/:\s*React\.FC(?:<[^>]*>)?/g, '');
  return code.trim();
}

/**
 * Detects the main component name from artifact source.
 */
function detectComponentName(source) {
  const defaultFnMatch = source.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultFnMatch) return defaultFnMatch[1];

  const defaultIdMatch = source.match(/export\s+default\s+(\w+)\s*;/);
  if (defaultIdMatch) return defaultIdMatch[1];

  const constMatches = [
    ...source.matchAll(
      /(?:export\s+)?const\s+(\w+)\s*(?::\s*\w+(?:<[^>]*>)?\s*)?=\s*(?:\([^)]*\)\s*=>|\(\s*\)\s*=>|function)/g,
    ),
  ];
  if (constMatches.length > 0) {
    return constMatches[constMatches.length - 1][1];
  }

  const fnMatches = [...source.matchAll(/^function\s+(\w+)/gm)];
  if (fnMatches.length > 0) {
    return fnMatches[fnMatches.length - 1][1];
  }

  return 'App';
}

// ---------------------------------------------------------------------------
// Template generators
// ---------------------------------------------------------------------------

function generateNavigator(pascal, gameId) {
  return `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ${pascal}HomeScreen } from './${pascal}HomeScreen';
import { ${pascal}GameScreen } from './${pascal}GameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ${pascal}Navigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="${pascal}Home"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="${pascal}Home" component={${pascal}HomeScreen} />
    <Stack.Screen name="${pascal}Game" component={${pascal}GameScreen} />
  </Stack.Navigator>
);
`;
}

function generateContext(pascal, camel, gameId) {
  return `import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY = '@game_${gameId}_best_score';

interface ${pascal}ContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ${pascal}Context = createContext<${pascal}ContextType | null>(null);

export const ${pascal}Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const stored = await AsyncStorage.getItem(\`\${STORAGE_KEY}:\${userId}\`);
        if (stored !== null) {
          setBestScore(Number(stored));
        }
      } catch {
        // Ignore storage errors
      }
    };
    loadScore();
  }, [userId]);

  const updateBestScore = (score: number) => {
    if (score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem(\`\${STORAGE_KEY}:\${userId}\`, String(score)).catch(() => {});
    }
  };

  return (
    <${pascal}Context.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </${pascal}Context.Provider>
  );
};

export const use${pascal} = () => {
  const ctx = useContext(${pascal}Context);
  if (!ctx) {
    throw new Error('use${pascal} must be used within ${pascal}Provider');
  }
  return ctx;
};
`;
}

function generateHomeScreen(pascal, camel, gameId) {
  return `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenNavigationProp } from '../types/navigation';
import { use${pascal} } from '../context/${pascal}Context';

type Props = {
  navigation: ScreenNavigationProp<'${pascal}Home'>;
};

export const ${pascal}HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = use${pascal}();

  const handlePlay = () => {
    navigation.navigate('${pascal}Game');
  };

  const handleBack = () => {
    navigation.getParent()?.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{t('${camel}.title')}</Text>
        <Text style={styles.subtitle}>{t('${camel}.subtitle')}</Text>
        <Text style={styles.instructions}>{t('${camel}.instructions')}</Text>

        {bestScore > 0 && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('${camel}.bestScore')}</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.playButton} onPress={handlePlay} accessibilityRole="button">
          <Text style={styles.playText}>{t('${camel}.play')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 140,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#9b59b6',
  },
  playButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  playText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
`;
}

function generateGameScreen(pascal, camel, gameId, artifactSource) {
  const componentName = detectComponentName(artifactSource);
  const strippedCode = stripModuleSyntax(artifactSource);

  // Escape backticks and ${} in the artifact source for template literal embedding
  const escapedCode = strippedCode.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  return `import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter, ArtifactMessage } from '../components/ArtifactGameAdapter';
import { use${pascal} } from '../context/${pascal}Context';

type Props = NativeStackScreenProps<RootStackParamList, '${pascal}Game'>;

/**
 * HTML content generated from the Claude AI Artifact.
 * Original component name: ${componentName}
 *
 * The artifact communicates with React Native via window.RNBridge:
 *   window.RNBridge.sendScore(score)   - report score updates
 *   window.RNBridge.gameOver(score)    - signal game over
 *   window.RNBridge.navigate('back')   - request navigation back
 */
const ARTIFACT_HTML = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${pascal}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\\/script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"><\\/script>
  <script src="https://cdn.tailwindcss.com"><\\/script>
  <script>
    window.RNBridge = {
      send: function(message) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        } else if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify(message), '*');
        }
      },
      sendScore: function(score) { this.send({ type: 'scoreUpdate', payload: { score: score } }); },
      gameOver: function(finalScore) { this.send({ type: 'gameOver', payload: { finalScore: finalScore } }); },
      navigate: function(target) { this.send({ type: 'navigate', payload: { target: target || 'back' } }); }
    };
  <\\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useRef, useMemo, useReducer, useContext, createContext } = React;

    ${escapedCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  <\\/script>
</body>
</html>\`;

export const ${pascal}GameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = use${pascal}();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleScoreUpdate = useCallback(
    (newScore: number) => {
      setScore(newScore);
    },
    [],
  );

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setScore(finalScore);
      setGameOver(true);
      updateBestScore(finalScore);
    },
    [updateBestScore],
  );

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === 'back') {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        {score > 0 && <Text style={styles.scoreText}>{score}</Text>}
      </View>

      <View style={styles.gameArea}>
        <ArtifactGameAdapter
          htmlContent={ARTIFACT_HTML}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onNavigate={handleNavigate}
        />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{t('${camel}.gameOver.title')}</Text>
            <Text style={styles.overlayScore}>{score}</Text>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                // Force re-mount the WebView by navigating away and back
                navigation.replace('${pascal}Game');
              }}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('${camel}.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 260,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overlayScore: {
    fontSize: 40,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
`;
}

// ---------------------------------------------------------------------------
// File modifiers
// ---------------------------------------------------------------------------

function updateNavigationTypes(pascal) {
  const filePath = path.join(SRC, 'types', 'navigation.ts');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if routes already exist
  if (content.includes(`${pascal}Home`)) {
    console.log(`  [skip] Navigation types already contain ${pascal}Home`);
    return;
  }

  // Find the closing }; of RootStackParamList (first }; after the type declaration)
  const typeStart = content.indexOf('export type RootStackParamList');
  if (typeStart === -1) {
    console.error('  [error] Could not find RootStackParamList in navigation.ts');
    return;
  }
  const lastIndex = content.indexOf('};', typeStart);
  if (lastIndex === -1) {
    console.error('  [error] Could not find closing }; for RootStackParamList');
    return;
  }

  const insertion = `  /** ${pascal} home screen */\n  ${pascal}Home: undefined;\n  /** ${pascal} game screen */\n  ${pascal}Game: undefined;\n`;

  content = content.slice(0, lastIndex) + insertion + content.slice(lastIndex);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  [updated] ${filePath}`);
}

function updateAppTsx(pascal, camel, gameId, emoji, category) {
  const filePath = path.join(ROOT, 'App.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already registered
  if (content.includes(`id: '${gameId}'`)) {
    console.log(`  [skip] App.tsx already contains registration for ${gameId}`);
    return;
  }

  // Add imports after the last import block
  const importLines = [
    `import { ${pascal}Provider } from './src/context/${pascal}Context';`,
    `import { ${pascal}Navigator } from './src/screens/${pascal}Navigator';`,
  ];

  // Find last import statement
  const importRegex = /^import\s+.*;\s*$/gm;
  let lastImportIndex = 0;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportIndex = match.index + match[0].length;
  }

  // Insert new imports right after the last existing import
  const newImports = '\n' + importLines.join('\n');
  content =
    content.slice(0, lastImportIndex) +
    newImports +
    content.slice(lastImportIndex);

  // Add registration before "const Stack ="
  const stackMarker = 'const Stack = createNativeStackNavigator';
  const stackIndex = content.indexOf(stackMarker);
  if (stackIndex === -1) {
    console.error('  [error] Could not find Stack declaration in App.tsx');
    return;
  }

  const registration = `
// Register the ${camel} game
gameRegistry.register({
  id: '${gameId}',
  nameKey: 'selectGame.${camel}.name',
  descriptionKey: 'selectGame.${camel}.description',
  emoji: '${emoji}',
  category: '${category}',
  navigator: ${pascal}Navigator,
  providers: [${pascal}Provider],
  isEnabled: true,
});

`;

  content = content.slice(0, stackIndex) + registration + content.slice(stackIndex);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  [updated] ${filePath}`);
}

function updateLocaleFile(filePath, camel, name, description) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);

  // Add selectGame entry
  if (!json.selectGame) json.selectGame = {};
  if (!json.selectGame[camel]) {
    json.selectGame[camel] = { name, description };
  }

  // Add game-specific i18n keys
  if (!json[camel]) {
    json[camel] = {
      title: name,
      subtitle: description,
      instructions: `Play ${name} and try to beat your best score!`,
      play: 'Play!',
      bestScore: 'Best Score',
      score: 'Score',
      gameOver: {
        title: 'Game Over!',
        score: 'Score',
        newBest: 'New Best!',
        playAgain: 'Play Again',
      },
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  console.log(`  [updated] ${filePath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Parses a CLI flag value: --flag value
 */
function getFlag(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return '';
}

async function main() {
  console.log('');
  console.log('====================================');
  console.log('  Game Creation System');
  console.log('  From Claude AI Artifact to Game');
  console.log('====================================');
  console.log('');

  // Check for non-interactive mode (all required flags provided)
  const flagArtifact = getFlag('artifact');
  const flagName = getFlag('name');
  const flagId = getFlag('id');
  const flagDescription = getFlag('description');
  const flagEmoji = getFlag('emoji');
  const flagCategory = getFlag('category');
  const isNonInteractive = flagArtifact && (flagName || flagId);

  let rl = null;
  if (!isNonInteractive) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  try {
    // --- Collect user inputs ---

    let artifactPath = flagArtifact;
    if (!artifactPath && rl) {
      artifactPath = await ask(rl, 'Path to Claude Artifact .tsx file');
    }

    if (!artifactPath) {
      console.error('Error: --artifact <path> is required.');
      console.error('Usage: node scripts/create-game.js --artifact path/to/artifact.tsx [--name "Game Name"] [--id game-id] [--description "..."] [--emoji "🎮"] [--category casual]');
      process.exit(1);
    }

    // Resolve and validate artifact path
    artifactPath = path.resolve(artifactPath);
    if (!fs.existsSync(artifactPath)) {
      console.error(`\nError: File not found: ${artifactPath}`);
      console.error('Please provide a valid path to a .tsx artifact file.');
      process.exit(1);
    }

    const artifactSource = fs.readFileSync(artifactPath, 'utf-8');
    const detectedName = detectComponentName(artifactSource);

    console.log(`Detected component: ${detectedName}`);
    console.log('');

    const defaultDisplayName = detectedName.replace(/([A-Z])/g, ' $1').trim();
    const gameName = flagName || (rl ? await ask(rl, 'Game name (display name)', defaultDisplayName) : defaultDisplayName);
    const gameId = flagId || (rl ? await ask(rl, 'Game ID (kebab-case)', toKebabCase(gameName)) : toKebabCase(gameName));
    const description = flagDescription || (rl ? await ask(rl, 'Short description', `Play ${gameName}!`) : `Play ${gameName}!`);
    const emoji = flagEmoji || (rl ? await ask(rl, 'Emoji icon', '🎮') : '🎮');
    const categoryInput = flagCategory || (rl ? await ask(rl, 'Category (pet/puzzle/adventure/casual)', 'casual') : 'casual');
    const category = ['pet', 'puzzle', 'adventure', 'casual'].includes(categoryInput)
      ? categoryInput
      : 'casual';

    const pascal = toPascalCase(gameName);
    const camel = toCamelCase(gameName);

    console.log('--- Summary ---');
    console.log(`  Game ID:      ${gameId}`);
    console.log(`  Display Name: ${gameName}`);
    console.log(`  Description:  ${description}`);
    console.log(`  Emoji:        ${emoji}`);
    console.log(`  Category:     ${category}`);
    console.log(`  PascalCase:   ${pascal}`);
    console.log(`  camelCase:    ${camel}`);
    console.log(`  Component:    ${detectedName}`);
    console.log('');

    if (rl && !isNonInteractive) {
      const confirm = await ask(rl, 'Proceed? (y/n)', 'y');
      if (confirm.toLowerCase() !== 'y') {
        console.log('Cancelled.');
        process.exit(0);
      }
    }

    // --- Generate files ---

    console.log('\nGenerating files...\n');

    // 1. Navigator
    const navigatorPath = path.join(SRC, 'screens', `${pascal}Navigator.tsx`);
    fs.writeFileSync(navigatorPath, generateNavigator(pascal, gameId), 'utf-8');
    console.log(`  [created] ${navigatorPath}`);

    // 2. Context
    const contextPath = path.join(SRC, 'context', `${pascal}Context.tsx`);
    fs.writeFileSync(contextPath, generateContext(pascal, camel, gameId), 'utf-8');
    console.log(`  [created] ${contextPath}`);

    // 3. Home Screen
    const homeScreenPath = path.join(SRC, 'screens', `${pascal}HomeScreen.tsx`);
    fs.writeFileSync(homeScreenPath, generateHomeScreen(pascal, camel, gameId), 'utf-8');
    console.log(`  [created] ${homeScreenPath}`);

    // 4. Game Screen (with embedded artifact)
    const gameScreenPath = path.join(SRC, 'screens', `${pascal}GameScreen.tsx`);
    fs.writeFileSync(gameScreenPath, generateGameScreen(pascal, camel, gameId, artifactSource), 'utf-8');
    console.log(`  [created] ${gameScreenPath}`);

    // 5. Copy the original artifact for reference
    const artifactsDir = path.join(SRC, 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    const artifactCopyPath = path.join(artifactsDir, `${gameId}.tsx`);
    fs.copyFileSync(artifactPath, artifactCopyPath);
    console.log(`  [copied]  ${artifactCopyPath}`);

    // --- Update existing files ---

    console.log('\nUpdating existing files...\n');

    // 6. Navigation types
    updateNavigationTypes(pascal);

    // 7. App.tsx (imports + registration)
    updateAppTsx(pascal, camel, gameId, emoji, category);

    // 8. Locale files
    const enPath = path.join(SRC, 'locales', 'en.json');
    const ptPath = path.join(SRC, 'locales', 'pt-BR.json');
    updateLocaleFile(enPath, camel, gameName, description);
    updateLocaleFile(ptPath, camel, gameName, description);

    // --- Done ---

    console.log('\n====================================');
    console.log('  Game created successfully!');
    console.log('====================================');
    console.log('');
    console.log('Generated files:');
    console.log(`  - src/screens/${pascal}Navigator.tsx`);
    console.log(`  - src/context/${pascal}Context.tsx`);
    console.log(`  - src/screens/${pascal}HomeScreen.tsx`);
    console.log(`  - src/screens/${pascal}GameScreen.tsx`);
    console.log(`  - src/artifacts/${gameId}.tsx`);
    console.log('');
    console.log('Updated files:');
    console.log('  - App.tsx');
    console.log('  - src/types/navigation.ts');
    console.log('  - src/locales/en.json');
    console.log('  - src/locales/pt-BR.json');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run: pnpm start');
    console.log('  2. Your game will appear in the game selection screen');
    console.log('  3. To enable score reporting from your artifact, use:');
    console.log('       window.RNBridge.sendScore(score)');
    console.log('       window.RNBridge.gameOver(finalScore)');
    console.log('       window.RNBridge.navigate("back")');
    console.log('');
  } finally {
    if (rl) rl.close();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
