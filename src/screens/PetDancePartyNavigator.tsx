import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetDancePartyHomeScreen } from './PetDancePartyHomeScreen';
import { PetDancePartyGameScreen } from './PetDancePartyGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetDancePartyNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PetDancePartyHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PetDancePartyHome" component={PetDancePartyHomeScreen} />
    <Stack.Screen name="PetDancePartyGame" component={PetDancePartyGameScreen} />
  </Stack.Navigator>
);
