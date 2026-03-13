import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetDoctorHomeScreen } from './PetDoctorHomeScreen';
import { PetDoctorGameScreen } from './PetDoctorGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PetDoctorNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetDoctorHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PetDoctorHome" component={PetDoctorHomeScreen} />
    <Stack.Screen name="PetDoctorGame" component={PetDoctorGameScreen} />
  </Stack.Navigator>
);
