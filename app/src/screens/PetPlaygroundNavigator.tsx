import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetPlaygroundHomeScreen } from './PetPlaygroundHomeScreen';
import { PetPlaygroundGameScreen } from './PetPlaygroundGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetPlaygroundNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetPlaygroundHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetPlaygroundHome" component={PetPlaygroundHomeScreen} />
    <Stack.Screen name="PetPlaygroundGame" component={PetPlaygroundGameScreen} />
  </Stack.Navigator>
);
