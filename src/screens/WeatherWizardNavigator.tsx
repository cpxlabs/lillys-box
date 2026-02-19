import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeatherWizardHomeScreen } from './WeatherWizardHomeScreen';
import { WeatherWizardGameScreen } from './WeatherWizardGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const WeatherWizardNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="WeatherWizardHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="WeatherWizardHome" component={WeatherWizardHomeScreen} />
    <Stack.Screen name="WeatherWizardGame" component={WeatherWizardGameScreen} />
  </Stack.Navigator>
);
