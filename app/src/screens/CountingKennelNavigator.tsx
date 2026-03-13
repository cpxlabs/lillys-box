import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { CountingKennelHomeScreen } from './CountingKennelHomeScreen';
import { CountingKennelGameScreen } from './CountingKennelGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const CountingKennelNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="CountingKennelHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="CountingKennelHome" component={CountingKennelHomeScreen} />
    <Stack.Screen name="CountingKennelGame" component={CountingKennelGameScreen} />
  </Stack.Navigator>
);
