import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SnackStackHomeScreen } from './SnackStackHomeScreen';
import { SnackStackGameScreen } from './SnackStackGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SnackStackNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="SnackStackHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="SnackStackHome" component={SnackStackHomeScreen} />
    <Stack.Screen name="SnackStackGame" component={SnackStackGameScreen} />
  </Stack.Navigator>
);
