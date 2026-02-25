import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SlidingPuzzleHomeScreen } from './SlidingPuzzleHomeScreen';
import { SlidingPuzzleGameScreen } from './SlidingPuzzleGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SlidingPuzzleNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SlidingPuzzleHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="SlidingPuzzleHome" component={SlidingPuzzleHomeScreen} />
    <Stack.Screen name="SlidingPuzzleGame" component={SlidingPuzzleGameScreen} />
  </Stack.Navigator>
);
