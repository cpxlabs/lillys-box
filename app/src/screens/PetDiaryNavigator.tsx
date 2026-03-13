import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetDiaryHomeScreen } from './PetDiaryHomeScreen';
import { PetDiaryGameScreen } from './PetDiaryGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetDiaryNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetDiaryHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetDiaryHome" component={PetDiaryHomeScreen} />
    <Stack.Screen name="PetDiaryGame" component={PetDiaryGameScreen} />
  </Stack.Navigator>
);
