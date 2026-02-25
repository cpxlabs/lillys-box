import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaintSplashHomeScreen } from './PaintSplashHomeScreen';
import { PaintSplashGameScreen } from './PaintSplashGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PaintSplashNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PaintSplashHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PaintSplashHome" component={PaintSplashHomeScreen} />
    <Stack.Screen name="PaintSplashGame" component={PaintSplashGameScreen} />
  </Stack.Navigator>
);
