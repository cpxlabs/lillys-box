import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MemoryBoardHomeScreen } from './MemoryBoardHomeScreen';
import { MemoryBoardGameScreen } from './MemoryBoardGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MemoryBoardNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MemoryBoardHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="MemoryBoardHome" component={MemoryBoardHomeScreen} />
    <Stack.Screen name="MemoryBoardGame" component={MemoryBoardGameScreen} />
  </Stack.Navigator>
);
