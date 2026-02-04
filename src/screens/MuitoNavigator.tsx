import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MuitoHomeScreen } from './MuitoHomeScreen';
import { MuitoGameScreen } from './MuitoGameScreen';
import { MuitoLobbyScreen } from './MuitoLobbyScreen';
import { MuitoMultiGameScreen } from './MuitoMultiGameScreen';
import { MuitoResultsScreen } from './MuitoResultsScreen';
import { MultiPlayerMuitoProvider } from '../context/MultiPlayerMuitoContext';

const Stack = createNativeStackNavigator();

export const MuitoNavigator: React.FC = () => (
  <MultiPlayerMuitoProvider>
    <Stack.Navigator
      initialRouteName="MuitoHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MuitoHome" component={MuitoHomeScreen} />
      <Stack.Screen name="MuitoGame" component={MuitoGameScreen} />
      <Stack.Screen name="MuitoLobby" component={MuitoLobbyScreen} />
      <Stack.Screen name="MuitoMultiGame" component={MuitoMultiGameScreen} />
      <Stack.Screen name="MuitoResults" component={MuitoResultsScreen} />
    </Stack.Navigator>
  </MultiPlayerMuitoProvider>
);
