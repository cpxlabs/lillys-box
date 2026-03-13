import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetTangramHomeScreen } from './PetTangramHomeScreen';
import { PetTangramGameScreen } from './PetTangramGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetTangramNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetTangramHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetTangramHome" component={PetTangramHomeScreen} />
    <Stack.Screen name="PetTangramGame" component={PetTangramGameScreen} />
  </Stack.Navigator>
);
