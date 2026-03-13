import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TreatTossHomeScreen } from './TreatTossHomeScreen';
import { TreatTossGameScreen } from './TreatTossGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const TreatTossNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="TreatTossHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="TreatTossHome" component={TreatTossHomeScreen} />
    <Stack.Screen name="TreatTossGame" component={TreatTossGameScreen} />
  </Stack.Navigator>
);
