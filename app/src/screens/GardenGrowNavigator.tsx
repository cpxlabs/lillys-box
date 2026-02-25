import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GardenGrowHomeScreen } from './GardenGrowHomeScreen';
import { GardenGrowGameScreen } from './GardenGrowGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const GardenGrowNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="GardenGrowHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="GardenGrowHome" component={GardenGrowHomeScreen} />
    <Stack.Screen name="GardenGrowGame" component={GardenGrowGameScreen} />
  </Stack.Navigator>
);
