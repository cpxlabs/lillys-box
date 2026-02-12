import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WhackAMoleHomeScreen } from './WhackAMoleHomeScreen';
import { WhackAMoleGameScreen } from './WhackAMoleGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const WhackAMoleNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="WhackAMoleHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="WhackAMoleHome" component={WhackAMoleHomeScreen} />
    <Stack.Screen name="WhackAMoleGame" component={WhackAMoleGameScreen} />
  </Stack.Navigator>
);
