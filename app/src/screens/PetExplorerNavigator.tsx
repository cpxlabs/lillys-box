import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetExplorerHomeScreen } from './PetExplorerHomeScreen';
import { PetExplorerGameScreen } from './PetExplorerGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetExplorerNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PetExplorerHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PetExplorerHome" component={PetExplorerHomeScreen} />
    <Stack.Screen name="PetExplorerGame" component={PetExplorerGameScreen} />
  </Stack.Navigator>
);
