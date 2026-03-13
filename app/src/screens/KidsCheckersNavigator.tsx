import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { KidsCheckersHomeScreen } from './KidsCheckersHomeScreen';
import { KidsCheckersGameScreen } from './KidsCheckersGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const KidsCheckersNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="KidsCheckersHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="KidsCheckersHome" component={KidsCheckersHomeScreen} />
    <Stack.Screen name="KidsCheckersGame" component={KidsCheckersGameScreen} />
  </Stack.Navigator>
);
