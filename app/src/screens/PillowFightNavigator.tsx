import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PillowFightHomeScreen } from './PillowFightHomeScreen';
import { PillowFightGameScreen } from './PillowFightGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PillowFightNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PillowFightHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PillowFightHome" component={PillowFightHomeScreen} />
    <Stack.Screen name="PillowFightGame" component={PillowFightGameScreen} />
  </Stack.Navigator>
);
