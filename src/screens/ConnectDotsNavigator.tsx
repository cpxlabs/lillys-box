import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectDotsHomeScreen } from './ConnectDotsHomeScreen';
import { ConnectDotsGameScreen } from './ConnectDotsGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ConnectDotsNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="ConnectDotsHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="ConnectDotsHome" component={ConnectDotsHomeScreen} />
    <Stack.Screen name="ConnectDotsGame" component={ConnectDotsGameScreen} />
  </Stack.Navigator>
);
