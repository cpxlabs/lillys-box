import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SnakesLaddersHomeScreen } from './SnakesLaddersHomeScreen';
import { SnakesLaddersGameScreen } from './SnakesLaddersGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SnakesLaddersNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SnakesLaddersHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="SnakesLaddersHome" component={SnakesLaddersHomeScreen} />
    <Stack.Screen name="SnakesLaddersGame" component={SnakesLaddersGameScreen} />
  </Stack.Navigator>
);
