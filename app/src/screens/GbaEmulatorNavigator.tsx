import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GbaEmulatorHomeScreen } from './GbaEmulatorHomeScreen';
import { GbaEmulatorGameScreen } from './GbaEmulatorGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const GbaEmulatorNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="GbaEmulatorHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="GbaEmulatorHome" component={GbaEmulatorHomeScreen} />
    <Stack.Screen name="GbaEmulatorGame" component={GbaEmulatorGameScreen} />
  </Stack.Navigator>
);
