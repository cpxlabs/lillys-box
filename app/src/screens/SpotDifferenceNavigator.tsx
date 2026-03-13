import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SpotDifferenceHomeScreen } from './SpotDifferenceHomeScreen';
import { SpotDifferenceGameScreen } from './SpotDifferenceGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SpotDifferenceNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SpotDifferenceHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="SpotDifferenceHome" component={SpotDifferenceHomeScreen} />
    <Stack.Screen name="SpotDifferenceGame" component={SpotDifferenceGameScreen} />
  </Stack.Navigator>
);
