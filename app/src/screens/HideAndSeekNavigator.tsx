import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HideAndSeekHomeScreen } from './HideAndSeekHomeScreen';
import { HideAndSeekGameScreen } from './HideAndSeekGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HideAndSeekNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="HideAndSeekHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="HideAndSeekHome" component={HideAndSeekHomeScreen} />
    <Stack.Screen name="HideAndSeekGame" component={HideAndSeekGameScreen} />
  </Stack.Navigator>
);
