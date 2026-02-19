import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetTaxiHomeScreen } from './PetTaxiHomeScreen';
import { PetTaxiGameScreen } from './PetTaxiGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetTaxiNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PetTaxiHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PetTaxiHome" component={PetTaxiHomeScreen} />
    <Stack.Screen name="PetTaxiGame" component={PetTaxiGameScreen} />
  </Stack.Navigator>
);
