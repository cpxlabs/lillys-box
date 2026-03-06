import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StarCatcherHomeScreen } from './StarCatcherHomeScreen';
import { StarCatcherGameScreen } from './StarCatcherGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StarCatcherNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="StarCatcherHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="StarCatcherHome" component={StarCatcherHomeScreen} />
    <Stack.Screen name="StarCatcherGame" component={StarCatcherGameScreen} />
  </Stack.Navigator>
);
