import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TicTacToeHomeScreen } from './TicTacToeHomeScreen';
import { TicTacToeGameScreen } from './TicTacToeGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const TicTacToeNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="TicTacToeHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="TicTacToeHome" component={TicTacToeHomeScreen} />
    <Stack.Screen name="TicTacToeGame" component={TicTacToeGameScreen} />
  </Stack.Navigator>
);
