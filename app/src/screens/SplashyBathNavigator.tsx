import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SplashyBathHomeScreen } from './SplashyBathHomeScreen';
import { SplashyBathGameScreen } from './SplashyBathGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SplashyBathNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SplashyBathHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="SplashyBathHome" component={SplashyBathHomeScreen} />
    <Stack.Screen name="SplashyBathGame" component={SplashyBathGameScreen} />
  </Stack.Navigator>
);
