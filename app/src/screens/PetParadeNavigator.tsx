import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetParadeHomeScreen } from './PetParadeHomeScreen';
import { PetParadeGameScreen } from './PetParadeGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetParadeNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetParadeHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetParadeHome" component={PetParadeHomeScreen} />
    <Stack.Screen name="PetParadeGame" component={PetParadeGameScreen} />
  </Stack.Navigator>
);
