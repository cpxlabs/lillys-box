import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MemoryMatchHomeScreen } from './MemoryMatchHomeScreen';
import { MemoryMatchGameScreen } from './MemoryMatchGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MemoryMatchNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MemoryMatchHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="MemoryMatchHome" component={MemoryMatchHomeScreen} />
    <Stack.Screen name="MemoryMatchGame" component={MemoryMatchGameScreen} />
  </Stack.Navigator>
);
