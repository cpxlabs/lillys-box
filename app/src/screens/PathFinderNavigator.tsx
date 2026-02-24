import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PathFinderHomeScreen } from './PathFinderHomeScreen';
import { PathFinderGameScreen } from './PathFinderGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PathFinderNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PathFinderHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PathFinderHome" component={PathFinderHomeScreen} />
    <Stack.Screen name="PathFinderGame" component={PathFinderGameScreen} />
  </Stack.Navigator>
);
