import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SimonSaysHomeScreen } from './SimonSaysHomeScreen';
import { SimonSaysGameScreen } from './SimonSaysGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SimonSaysNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SimonSaysHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="SimonSaysHome" component={SimonSaysHomeScreen} />
    <Stack.Screen name="SimonSaysGame" component={SimonSaysGameScreen} />
  </Stack.Navigator>
);
