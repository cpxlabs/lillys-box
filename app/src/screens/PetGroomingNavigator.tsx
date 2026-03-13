import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetGroomingHomeScreen } from './PetGroomingHomeScreen';
import { PetGroomingGameScreen } from './PetGroomingGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetGroomingNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetGroomingHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetGroomingHome" component={PetGroomingHomeScreen} />
    <Stack.Screen name="PetGroomingGame" component={PetGroomingGameScreen} />
  </Stack.Navigator>
);
