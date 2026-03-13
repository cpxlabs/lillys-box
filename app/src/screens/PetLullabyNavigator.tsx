import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetLullabyHomeScreen } from './PetLullabyHomeScreen';
import { PetLullabyGameScreen } from './PetLullabyGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetLullabyNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetLullabyHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetLullabyHome" component={PetLullabyHomeScreen} />
    <Stack.Screen name="PetLullabyGame" component={PetLullabyGameScreen} />
  </Stack.Navigator>
);
