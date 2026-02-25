import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetChefHomeScreen } from './PetChefHomeScreen';
import { PetChefGameScreen } from './PetChefGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetChefNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PetChefHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PetChefHome" component={PetChefHomeScreen} />
    <Stack.Screen name="PetChefGame" component={PetChefGameScreen} />
  </Stack.Navigator>
);
