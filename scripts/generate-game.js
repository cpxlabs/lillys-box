#!/usr/bin/env node

/**
 * Game Generator Script
 * Creates a new game with Context, Navigator, and screen files
 * 
 * Usage: node scripts/generate-game.js --name="My Game" --id="my-game" --emoji="🎮" --category="casual"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const params = {};

args.forEach(arg => {
  const [key, value] = arg.split('=');
  params[key.replace('--', '')] = value;
});

const { name, id, emoji, category } = params;

if (!name || !id || !emoji || !category) {
  console.error(`
Usage: node scripts/generate-game.js \\
  --name="Game Name" \\
  --id="game-id" \\
  --emoji="🎮" \\
  --category="casual|puzzle|adventure|pet"
  `);
  process.exit(1);
}

const pascalCase = (str) =>
  str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const PascalName = pascalCase(id);
const appDir = path.join(__dirname, '..', 'app');
const srcDir = path.join(appDir, 'src');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const contextTemplate = (name) => `import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface ${name}ContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ${name}Context = createContext<${name}ContextType | null>(null);

export const ${name}Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_${id}_best_score');
  
  return (
    <${name}Context.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </${name}Context.Provider>
  );
};

export const use${name} = () => {
  const ctx = useContext(${name}Context);
  if (!ctx) throw new Error('use${name} must be used within ${name}Provider');
  return ctx;
};
`;

const navigatorTemplate = (name, id) => `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ${name}HomeScreen } from './${name}HomeScreen';
import { ${name}GameScreen } from './${name}GameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ${name}Navigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="${name}Home"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="${name}Home" component={${name}HomeScreen} />
    <Stack.Screen name="${name}Game" component={${name}GameScreen} />
  </Stack.Navigator>
);
`;

const homeScreenTemplate = (name) => `import React from 'react';
import { View, Style Sheet, Text } from 'react-native';
import { use${name} } from '../context/${name}Context';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';

export const ${name}HomeScreen: React.FC<any> = ({ navigation }) => {
  const { bestScore } = use${name}();

  return (
    <View style={styles.container}>
      <ScreenHeader title="selectGame.${id.replace(/-/g, '')}.name" />
      
      <View style={styles.content}>
        <View style={styles.scoreSection}>
          <Text style={styles.label}>Best Score:</Text>
          <Text style={styles.score}>{bestScore}</Text>
        </View>

        <IconButton
          label="Play"
          icon="▶"
          onPress={() => navigation.navigate('${name}Game')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  button: {
    width: '100%',
  },
});
`;

const gameScreenTemplate = (name) => `import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { use${name} } from '../context/${name}Context';
import { IconButton } from '../components/IconButton';

export const ${name}GameScreen: React.FC<any> = ({ navigation }) => {
  const { bestScore, updateBestScore } = use${name}();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = () => {
    if (score > bestScore) {
      updateBestScore(score);
    }
    setGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton 
          icon="←" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.scoreText}>{score}</Text>
      </View>

      <View style={styles.gameArea}>
        {/* Game content here */}
        <Text style={styles.placeholder}>Game Content</Text>
      </View>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
          <IconButton
            label="Play Again"
            icon="↻"
            onPress={handleRestart}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flex: 0,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 32,
  },
});
`;

try {
  // Create context file
  ensureDir(path.join(srcDir, 'context'));
  const contextPath = path.join(srcDir, 'context', `${PascalName}Context.tsx`);
  if (!fs.existsSync(contextPath)) {
    fs.writeFileSync(contextPath, contextTemplate(PascalName));
    console.log(`✓ Created ${contextPath}`);
  }

  // Create navigator file
  ensureDir(path.join(srcDir, 'screens'));
  const navigatorPath = path.join(srcDir, 'screens', `${PascalName}Navigator.tsx`);
  if (!fs.existsSync(navigatorPath)) {
    fs.writeFileSync(navigatorPath, navigatorTemplate(PascalName, id));
    console.log(`✓ Created ${navigatorPath}`);
  }

  // Create home screen file
  const homeScreenPath = path.join(srcDir, 'screens', `${PascalName}HomeScreen.tsx`);
  if (!fs.existsSync(homeScreenPath)) {
    fs.writeFileSync(homeScreenPath, homeScreenTemplate(PascalName));
    console.log(`✓ Created ${homeScreenPath}`);
  }

  // Create game screen file
  const gameScreenPath = path.join(srcDir, 'screens', `${PascalName}GameScreen.tsx`);
  if (!fs.existsSync(gameScreenPath)) {
    fs.writeFileSync(gameScreenPath, gameScreenTemplate(PascalName));
    console.log(`✓ Created ${gameScreenPath}`);
  }

  // Generate registration code
  const registrationCode = `
  gameRegistry.register({
    id: '${id}',
    nameKey: 'selectGame.${id.replace(/-/g, '')}.name',
    descriptionKey: 'selectGame.${id.replace(/-/g, '')}.description',
    emoji: '${emoji}',
    category: '${category}',
    navigator: ${PascalName}Navigator,
    providers: [${PascalName}Provider],
    isEnabled: true,
  });
`;

  console.log('\n✓ Game files created successfully!\n');
  console.log('Next steps:');
  console.log('1. Add to gameRegistrations.ts:');
  console.log('   - Import: import { ' + PascalName + 'Provider } from \'./context/' + PascalName + 'Context\';');
  console.log('   - Import: import { ' + PascalName + 'Navigator } from \'./screens/' + PascalName + 'Navigator\';');
  console.log('   - Register:');
  console.log(registrationCode);
  console.log('2. Add i18n translations for:');
  console.log('   - selectGame.' + id.replace(/-/g, '') + '.name');
  console.log('   - selectGame.' + id.replace(/-/g, '') + '.description');
  console.log('\nScaffold created! Now customize the game logic in ' + gameScreenPath);
} catch (error) {
  console.error('Error creating game:', error.message);
  process.exit(1);
}
